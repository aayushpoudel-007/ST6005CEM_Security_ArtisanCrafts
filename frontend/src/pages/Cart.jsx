import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="bg-white min-h-screen p-8">
      <div className="container flex flex-col items-start mx-auto">
        {cartItems.length === 0 ? (
          <div>
            Your cart is empty <Link to="/shop" className="text-blue-500">Go To Shop</Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col w-full max-w-4xl bg-gray-100 p-4 rounded-lg shadow-lg">
              <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>

              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center mb-4 p-4 bg-white rounded-lg shadow-md border border-gray-300">
                  <div className="w-24 h-24">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  <div className="flex-1 ml-4">
                    <Link to={`/product/${item._id}`} className="text-pink-500 hover:underline">
                      {item.name}
                    </Link>

                    <div className="mt-2 text-gray-700">{item.brand}</div>
                    <div className="mt-2 text-gray-700 font-bold">
                      $ {item.price}
                    </div>
                  </div>

                  <div className="w-24">
                    <select
                      className="w-full p-1 border rounded text-black"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <button
                      className="text-red-500 ml-4"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-8 bg-white p-4 rounded-lg shadow-md border border-gray-300">
                <h2 className="text-xl font-semibold mb-2">
                  Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                </h2>

                <div className="text-2xl font-bold">
                  $ {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                </div>

                <button
                  className="bg-pink-500 mt-4 py-2 px-4 rounded-full text-lg w-full text-white"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed To Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
