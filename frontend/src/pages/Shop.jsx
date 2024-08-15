import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { setCategories, setProducts, setChecked } from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector((state) => state.shop);
  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filteredProducts = filteredProductsQuery.data.filter((product) => {
          return (
            product.price.toString().includes(priceFilter) ||
            product.price === parseInt(priceFilter, 10)
          );
        });

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter((product) => product.brand === brand);
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto py-8">
        <div className="flex md:flex-row flex-col">
          <div className="bg-white p-4 border rounded-lg shadow-lg w-full md:w-1/4 mb-6 md:mb-0">
            <h2 className="text-xl font-semibold py-2 border-b mb-4 text-black">Filter by Categories</h2>
            <div className="space-y-2">
              {categories?.map((c) => (
                <div key={c._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${c._id}`}
                    onChange={(e) => handleCheck(e.target.checked, c._id)}
                    className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <label
                    htmlFor={`category-${c._id}`}
                    className="ml-2 text-sm font-medium text-black"
                  >
                    {c.name}
                  </label>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-semibold py-2 border-b mt-4 mb-4 text-black">Filter by Brands</h2>
            <div className="space-y-2">
              {uniqueBrands?.map((brand) => (
                <div key={brand} className="flex items-center">
                  <input
                    type="radio"
                    id={`brand-${brand}`}
                    name="brand"
                    onChange={() => handleBrandClick(brand)}
                    className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500"
                  />
                  <label
                    htmlFor={`brand-${brand}`}
                    className="ml-2 text-sm font-medium text-black"
                  >
                    {brand}
                  </label>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-semibold py-2 border-b mt-4 mb-4 text-black">Filter by Price</h2>
            <input
              type="text"
              placeholder="Enter Price"
              value={priceFilter}
              onChange={handlePriceChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-pink-300 text-black"
            />

            <div className="mt-4">
              <button
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="w-full md:w-3/4">
            <h2 className="text-xl font-semibold mb-4 text-black">{products?.length} Products</h2>
            <div className="flex flex-wrap">
              {products.length === 0 ? (
                <Loader />
              ) : (
                products?.map((p) => (
                  <div className="p-3 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4" key={p._id}>
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
