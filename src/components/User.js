import { useReducer, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { users: action.payload.users };

    default:
      throw new Error();
  }
}

const initialUserState = {
  users: [],
};

const User = () => {
  const [userState, dispatchUser] = useReducer(reducer, initialUserState);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUser = async () => {
      try {
        const response = await axiosPrivate.get("/users", {
          signal: controller.signal, //เพื่อการ cancel request if need
        });
        console.log(response.data);

        isMounted &&
          dispatchUser({ type: "SET_USER", payload: { users: response.data } });
      } catch (err) {
        console.error(err);
      }
    };

    getUser();

    return () => {
      isMounted = false; //คล้ายๆ isLoading ป้ะ
      controller.abort(); //เมื่อ Component unmount ก็ให้ยกเลิกทุก request *ทั้งที่ pending อยู่ด้วย
    };
  }, [axiosPrivate]);
  return (
    <article>
      <h2>Users List</h2>
      {userState.users?.length ? (
        <ul>
          {userState.users.map((user, i) => (
            <li key={i}>{user?.username}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display.</p>
      )}

      {/* <button onClick={refresh}>Refresh Token</button>
      <br /> */}
    </article>
  );
};

export default User;
