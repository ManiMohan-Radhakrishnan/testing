import ActionCable from "actioncable";

const cable = ActionCable.createConsumer(process.env.REACT_APP_BASE_SOCKET_URL);

export default cable;
