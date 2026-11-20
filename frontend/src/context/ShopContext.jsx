import { createContext, useState, useEffect } from "react";
import { products as staticProducts, all_images } from "../assets/assets";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = "http://localhost:5000";

  const [products, setProducts] = useState(staticProducts);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/products?limit=100`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        console.warn("Backend products fetch returned failure, using static catalog:", data.message);
        setProducts(staticProducts);
      }
    } catch (error) {
      console.error("Could not fetch products from backend, using static catalog instead:", error);
      setProducts(staticProducts);
    } finally {
      setLoading(false);
    }
  };

  // Fetch current user details if token exists
  const fetchUserProfile = async (authToken) => {
    if (!authToken) return;
    try {
      const response = await fetch(`${backendUrl}/api/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    if (token) {
      fetchUserProfile(token);
    }
  }, [token]);

  // Auth Functions
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
        toast.success("Welcome back! Login successful.");
        return true;
      } else {
        toast.error(data.message || "Invalid credentials");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Network error during login");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
        toast.success("Account created successfully!");
        return true;
      } else {
        toast.error(data.message || "Registration failed");
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Network error during registration");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    toast.info("Logged out successfully.");
  };

  // Cart logic: cartKey = `${productId}_${size}_${color}`
  const addToCart = (productId, size, color) => {
    if (!size || !color) {
      toast.warning("Please select a size and color");
      return;
    }

    const cartKey = `${productId}_${size}_${color}`;
    setCartItems((prev) => {
      const currentQty = prev[cartKey] || 0;
      return { ...prev, [cartKey]: currentQty + 1 };
    });
    toast.success("Item added to cart!");
  };

  const updateCartQty = (cartKey, qty) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (qty <= 0) {
        delete updated[cartKey];
      } else {
        updated[cartKey] = qty;
      }
      return updated;
    });
  };

  const removeFromCart = (cartKey) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[cartKey];
      return updated;
    });
    toast.info("Item removed from cart");
  };

  const clearCart = () => {
    setCartItems({});
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

  const getCartAmount = () => {
    let total = 0;
    for (const key in cartItems) {
      const [productId] = key.split("_");
      const product = products.find((p) => p._id === productId);
      if (product) {
        total += product.price * cartItems[key];
      }
    }
    return total;
  };

  // Helper to map DB image name to local bundled file
  const getProductImage = (product, index = 0) => {
    if (!product) return "";
    
    // Case 1: Database format (images array of filenames/URLs)
    if (product.images && product.images.length > 0) {
      const imgName = product.images[index];
      if (imgName && imgName.startsWith("p_img")) {
        const key = imgName.split(".")[0];
        return all_images[key] || imgName;
      }
      return imgName;
    }

    // Case 2: Frontend static format (image array of resolved URLs)
    if (product.image && product.image.length > 0) {
      return product.image[index];
    }

    return "";
  };

  const addAddress = async (address) => {
    if (!token) return false;
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/auth/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(address)
      });
      const data = await response.json();
      if (data.success) {
        await fetchUserProfile(token);
        toast.success("Address added successfully!");
        return true;
      } else {
        toast.error(data.message || "Failed to add address");
        return false;
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Network error adding address");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    products,
    staticProducts,
    currency,
    delivery_fee,
    backendUrl,
    cartItems,
    token,
    user,
    loading,
    search,
    setSearch,
    setLoading,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartAmount,
    getProductImage,
    login,
    register,
    logout,
    addAddress
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;