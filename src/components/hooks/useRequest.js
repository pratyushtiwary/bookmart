import { useState } from "react";
import axios from "axios";

export default function useRequest(url) {
  const [data, setData] = useState(null);

  function makeRequest(params) {
    axios
      .post(url, params)
      .then((c) => {
        setData({ ...c.data });
      })
      .catch((e) => {
        setData({
          error: {
            msg: "Unable to connect to the server,please try again later",
          },
        });
      });
  }

  return [data, makeRequest];
}
