import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true, //เป็นการบอกว่าเราจะมี token อะไรบางอย่างส่งไปด้วย ซึ่งใน backend ก็ต้องบอกว่า Allow Control Access Origin กับอะไรอีกอย่างจำไม่ได้***
    });
    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken);
      return { ...prev, accessToken: response.data.accessToken };
    });
    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
