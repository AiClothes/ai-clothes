export interface CombineSpecifications {
  id: number;
  name: string;
  product_specification_values: {
    id: number;
    value: string;
  }[];
}

export interface Combinations {
  specification_id: number;
  name: string;
  specification_value_id: number;
  value: string;
}

export const combineSpecifications = (
  specs: CombineSpecifications[]
): Combinations[][] => {
  if (specs.length === 0) return [[]];

  // 取出第一个规格
  const [firstSpec, ...restSpecs] = specs;

  // 递归获取后面规格的组合
  const restCombinations = combineSpecifications(restSpecs);

  // 生成当前规格和后面规格组合的笛卡尔积
  const combinations: Combinations[][] = [];
  for (const value of firstSpec.product_specification_values) {
    for (const restCombination of restCombinations) {
      combinations.push([
        {
          specification_id: firstSpec.id,
          name: firstSpec.name,
          specification_value_id: value.id,
          value: value.value
        },
        ...restCombination
      ]);
    }
  }

  return combinations;
};
