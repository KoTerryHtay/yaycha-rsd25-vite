import useWebSocket, { ReadyState } from "react-use-websocket";
import { useApp } from "./utils";
import { useEffect } from "react";
import { queryClient } from "./ThemedApp";

export default function AppSocket() {
  const { auth } = useApp();

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    import.meta.env.VITE_WS
  );

  useEffect(() => {
    if (auth && readyState === ReadyState.OPEN) {
      sendJsonMessage({
        token: localStorage.getItem("token"),
      });

      console.log("WS: connection ready & token sent");
    }
  }, [auth, readyState, sendJsonMessage]);

  useEffect(() => {
    console.log("WS: new message received");

    // const { event } = lastJsonMessage as { event: string };

    if (lastJsonMessage && lastJsonMessage) {
      queryClient.invalidateQueries(lastJsonMessage);
      console.log("lastJsonMessage.event >>>", lastJsonMessage);
    }
  }, [lastJsonMessage]);

  return <></>;
}
