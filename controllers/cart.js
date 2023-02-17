const Cart = require("../models/Cart");
const Procduct = require("../models/Product");

exports.getByUserId = async (req, res, next) => {
  try {
    const reqData = req.query;
    // console.log("reqData:", reqData);
    let foundCart = await Cart.findOne({ userId: reqData.id }).select(
      "items total"
    );
    if (foundCart) {
      let cartItems = foundCart.items;
      // console.log("cartItems:", cartItems);

      const itemsWithDetail = await Promise.all(
        cartItems.map((item) => {
          return Procduct.findById(item.productId).select("img1 name");
        })
      );

      // thêm thuộc tính tên, hình ảnh trong mảng trả về FE
      cartItems = cartItems.map((cartItem, i) => {
        let _itemDetail = itemsWithDetail[i];

        if (cartItem.productId === _itemDetail._id.toString()) {
          // return cartItem mới nếu if thỏa điền kiện
          return {
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            price: cartItem.price,
            productName: _itemDetail.name,
            img: _itemDetail.img1,
          };
        }

        // return cartItem cũ nếu if không thỏa điền kiện
        return cartItem;
      });
      foundCart = { ...foundCart._doc, items: cartItems };
      //   console.log("foundCart:", foundCart);
      res.json(foundCart);
    }
  } catch (error) {
    return next(new Error(error));
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const reqData = req.body;
    console.log("reqData:", reqData);
    const userCart = await Cart.findOne({ userId: reqData.userId });
    console.log("userCart:", userCart);
    if (userCart) {
      const updateItems = [...userCart.items];
      updateItems.push(reqData.selectedItem);

      await Cart.findByIdAndUpdate(userCart._id, {
        items: updateItems,
      });
    }
    res.end();
  } catch (error) {
    return next(new Error(error));
  }
};

exports.updateItemQuantity = async (req, res, next) => {
  try {
    const reqData = req.body;
    const foundCart = await Cart.findOne({ userId: reqData.userId });

    Cart.findByIdAndUpdate(foundCart._id)
      .then((updatedCart) => {
        const itemIndex = updatedCart.items.findIndex(
          (item) => item.productId.toString() === reqData.productId
        );
        if (itemIndex >= 0) {
          updatedCart.items[itemIndex].quantity = reqData.quantity;
        }
        return updatedCart.save();
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (error) {
    return next(new Error(error));
  }
};
