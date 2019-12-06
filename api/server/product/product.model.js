const SequelizeGen = require("../helpers/SequelizeGen");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError");

var getProductInfoBySerno = prodserno => {
  const sequelize = SequelizeGen.createConnection();
  const Product = sequelize.import("../../db/models/db_product");

  return Product.findOne({ where: { boardSerno: prodserno }, raw: true })
    .then(productInfo => {
      return productInfo
        ? Promise.resolve(productInfo)
        : Promise.reject(
          new APIError("No such product exists!", httpStatus.NOT_FOUND)
        );
    })
    .catch(err => {
      // console.error(err);
      return Promise.reject(err);
    })
    .finally(() => {
      sequelize.close();
    });
};

var createProduct = productData => {
  const sequelize = SequelizeGen.createConnection();
  const Product = sequelize.import("../../db/models/db_product");

  return Product.create(productData)
    .then(product => {
      return Product.findOne({
        where : { userid: productData.userid, title: productData.title },
        raw   : true
      });
      // return product
      //   ? Promise.resolve(product)
      //   : Promise.reject(
      //     new APIError("No such product exists!", httpStatus.NOT_FOUND)
      //   );
    })
    .catch(err => {
      console.error(err);
      return Promise.reject(err);
    })
    .finally(() => {
      sequelize.close();
    });
};

var updateProduct = productData => {
  const sequelize = SequelizeGen.createConnection();
  const Product = sequelize.import("../../db/models/db_product");

  return Product.update(productData, {
    where : { boardSerno: productData.boardSerno }
  })
    .then(product => {
      return Product.findOne({ where: { boardSerno: productData.boardSerno } });
      // return product ? Promise.resolve(product) : Promise.reject(new APIError('No such product exists!', httpStatus.NOT_FOUND));
    })
    .catch(err => {
      console.error(err);
      return Promise.reject(err);
    })
    .finally(() => {
      sequelize.close();
    });
};

var deleteProduct = productData => {
  const sequelize = SequelizeGen.createConnection();
  const Product = sequelize.import("../../db/models/db_product");

  return Product.destroy({ where: { boardSerno: productData.boardSerno } })
    .then(product => {
      return product
        ? Promise.resolve(product)
        : Promise.reject(
          new APIError("No such product exists!", httpStatus.NOT_FOUND)
        );
    })
    .catch(err => {
      console.error(err);
      return Promise.reject(err);
    })
    .finally(() => {
      sequelize.close();
    });
};

module.exports = {
  getProductInfoBySerno,
  createProduct,
  updateProduct,
  deleteProduct
};
