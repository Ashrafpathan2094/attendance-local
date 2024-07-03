const getUser = async (params) => {
  const response = await fetch(
    "https://dummyjson.com/RESOURCE/?limit=10&skip=5&select=key1,key2,key3"
  );
  const result = await response.json();
  console.log("result", result);
  return result;
};
getUser();
