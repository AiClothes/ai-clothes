import { PrismaClient } from '.prisma/client';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const prisma = new PrismaClient();

console.log('__dirname', __dirname);
const product_categories_path = join(
  __dirname,
  'data/origin_data/product_categories.json'
);
console.log('product_categories_path', product_categories_path);
const product_path = join(__dirname, 'data/origin_data/products.json');
console.log('product_path', product_path);
const product_images_path = join(
  __dirname,
  'data/origin_data/product_images.json'
);
console.log('product_images_path', product_images_path);
const product_sell_long_images_path = join(
  __dirname,
  'data/origin_data/product_sell_long_images.json'
);
console.log('product_sell_long_images_path', product_sell_long_images_path);
const product_specifications_path = join(
  __dirname,
  'data/origin_data/product_specifications.json'
);
console.log('product_specifications_path', product_specifications_path);
const product_specification_values_path = join(
  __dirname,
  'data/origin_data/product_specification_values.json'
);
const product_specification_combinations_path = join(
  __dirname,
  'data/origin_data/product_specification_combinations.json'
);
const product_specification_combination_details_path = join(
  __dirname,
  'data/origin_data/product_specification_combination_details.json'
);

export const combineSpecifications = (specs) => {
  if (specs.length === 0) return [[]];

  // 取出第一个规格
  const [firstSpec, ...restSpecs] = specs;

  // 递归获取后面规格的组合
  const restCombinations = combineSpecifications(restSpecs);

  // 生成当前规格和后面规格组合的笛卡尔积
  const combinations = [];
  for (const value of firstSpec.product_specification_values) {
    for (const restCombination of restCombinations) {
      combinations.push([
        {
          specification_id: firstSpec.id,
          name: firstSpec.name,
          specification_value_id: value.new_data.id,
          value: value.new_data.value,
          new_data: value.new_data,
          old_data: value.old_data
        },
        ...restCombination
      ]);
    }
  }

  return combinations;
};

async function main() {
  try {
    // 读取商品数据
    let products = JSON.parse(readFileSync(product_path, 'utf-8'));
    console.log('products', products);
    // 读取商品分类数据
    let product_categories = JSON.parse(
      readFileSync(product_categories_path, 'utf-8')
    );
    product_categories = product_categories.product_categories.map((r) => ({
      ...r
    }));
    // 读取商品图片数据
    let product_images = JSON.parse(readFileSync(product_images_path, 'utf-8'));
    product_images = product_images.product_images.map((r) => ({
      ...r
    }));
    // 读取商品详情图片数据
    let product_sell_long_images = JSON.parse(
      readFileSync(product_sell_long_images_path, 'utf-8')
    );
    product_sell_long_images =
      product_sell_long_images.product_sell_long_images.map((r) => ({
        ...r
      }));
    // 读取商品规格数据
    let product_specifications = JSON.parse(
      readFileSync(product_specifications_path, 'utf-8')
    );
    product_specifications = product_specifications.product_specifications.map(
      (r) => ({
        ...r
      })
    );
    // 读取商品规格值数据
    let product_specification_values = JSON.parse(
      readFileSync(product_specification_values_path, 'utf-8')
    );
    product_specification_values =
      product_specification_values.product_specification_values.map((r) => ({
        ...r
      }));
    // 读取商品规格组合数据
    let product_specification_combinations = JSON.parse(
      readFileSync(product_specification_combinations_path, 'utf-8')
    );
    product_specification_combinations =
      product_specification_combinations.product_specification_combinations.map(
        (r) => ({
          ...r
        })
      );
    // 读取商品规格组合详情数据
    let product_specification_combination_details = JSON.parse(
      readFileSync(product_specification_combination_details_path, 'utf-8')
    );
    product_specification_combination_details =
      product_specification_combination_details.product_specification_combination_details.map(
        (r) => ({
          ...r
        })
      );
    products = products.products.map((product) => {
      const { id: product_id } = product;
      const product_category = product_categories.find(
        (category) => category.id === product.category_id
      );
      const _product_images = [];
      product_images.forEach((r) => {
        if (!r.deleted_at && r.product_id === product_id) {
          _product_images.push(r);
        }
      });
      const _product_sell_long_images = [];
      product_sell_long_images.forEach((r) => {
        if (!r.deleted_at && r.product_id === product_id) {
          _product_sell_long_images.push(r);
        }
      });
      const _product_specifications = [];
      product_specifications.forEach((r) => {
        const { id: specification_id } = r;
        if (!r.deleted_at && r.product_id === product_id) {
          const _product_specification_values = [];
          product_specification_values.forEach((r2) => {
            const { id: specification_value_id } = r2;
            if (!r2.deleted_at && r2.specification_id === specification_id) {
              const _product_specification_combinations_detail =
                product_specification_combination_details.filter(
                  (r3) => r3.specification_value_id === specification_value_id
                );
              _product_specification_values.push({
                ...r2,
                product_specification_combinations_detail:
                  _product_specification_combinations_detail
              });
            }
          });
          _product_specifications.push({
            ...r,
            product_specification_values: _product_specification_values
          });
        }
      });
      const _product_specification_combinations =
        product_specification_combinations.filter(
          (r2) => r2.product_id === product_id && !r2.deleted_at
        );
      return {
        ...product,
        product_category,
        product_images: _product_images,
        product_sell_long_images: _product_sell_long_images,
        product_specifications: _product_specifications,
        product_specification_combinations: _product_specification_combinations
      };
    });
    // 搜索product中name为金币的内容
    const jibi = products.find((product) => product.name === '金币');
    // 把金币这个东西放在第一位
    products = [jibi, ...products.filter((p) => p.name !== '金币')];
    writeFileSync(
      join(__dirname, 'data/processed_data/products.json'),
      JSON.stringify(products, null, 4)
    );
    // 开始写入数据
    for (const product of products) {
      const {
        product_category,
        product_images,
        product_sell_long_images,
        product_specifications,
        product_specification_combinations
      } = product;
      let _product_category = await prisma.productCategory.findFirst({
        where: {
          name: product_category.name
        }
      });
      if (!_product_category) {
        _product_category = await prisma.productCategory.create({
          data: {
            name: product_category.name,
            sort: product_category.sort,
            parent_id: product_category.parent_id,
            is_virtual_goods: product_category.is_virtual_goods
          }
        });
      }
      const _product = await prisma.product.create({
        data: {
          name: product.name,
          quantity: product.quantity,
          price: product.price,
          description: product.description,
          unit: product.unit,
          status: product.status,
          sort: product.sort,
          pay_account: product.pay_account,
          image: product.image,
          category_id: _product_category.id
        }
      });
      // 创建关联数据
      for (const r of product_images) {
        await prisma.productImage.create({
          data: {
            url: r.url,
            is_main: r.is_main === 1,
            product_id: _product.id
          }
        });
      }
      for (const r of product_sell_long_images) {
        await prisma.productSellLongImage.create({
          data: {
            url: r.url,
            sort: r.sort,
            product_id: _product.id
          }
        });
      }
      const _product_specifications = [];
      for (const r of product_specifications) {
        const { product_specification_values } = r;
        const _productSpecification = await prisma.productSpecification.create({
          data: {
            name: r.name,
            product_id: _product.id
          }
        });
        const _productSpecificationValues = [];
        for (const r2 of product_specification_values) {
          const { product_specification_combinations_detail } = r2;
          const _productSpecificationValue =
            await prisma.productSpecificationValue.create({
              data: {
                value: r2.value,
                specification_id: _productSpecification.id
              }
            });
          _productSpecificationValues.push({
            new_data: _productSpecificationValue,
            old_data: r2
          });
        }
        _product_specifications.push({
          ...r,
          product_specification_values: _productSpecificationValues
        });
      }
      // 用_product_specifications中的product_specification_values创建组合，_product_specifications下的每个product_specification_values里面的item都要组合一次
      const _combinations = combineSpecifications(_product_specifications);
      writeFileSync(
        join(__dirname, 'data/processed_data/combinations.json'),
        JSON.stringify(_combinations, null, 4)
      );
      for (const combination of _combinations) {
        const old_ids = combination
          .map((value) => value.old_data.id)
          .sort((a, b) => a - b)
          .join(',');
        const old_combination = product_specification_combinations.find(
          (r) => r.specification_value_ids === old_ids
        );
        console.log('old_combination', old_combination);
        const specification_value_ids = combination.map(
          (value) => value.specification_value_id
        );
        const productSpecificationCombination =
          await prisma.productSpecificationCombination.create({
            data: {
              product_id: _product.id,
              specification_value_ids: specification_value_ids.join(','),
              quantity: old_combination?.quantity || 0,
              image: old_combination?.image,
              draw_image: old_combination?.draw_image,
              draw_image_back: old_combination?.draw_image_back,
              price: old_combination?.price
            }
          });
        for (const value of combination) {
          await prisma.productSpecificationCombinationDetail.create({
            data: {
              combination_id: productSpecificationCombination.id,
              specification_value_id: value.specification_value_id
            }
          });
        }
      }
    }
  } catch (e) {
    console.error('处理异常，请重新开始', e.message);
  }
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect().then(() => process.exit(1));
});
