import ContentLoader from "react-content-loader";

const Loader = (props) => (
  <ContentLoader
    viewBox="0 0 100% 100%"
    width={"100%"}
    height={"100%"}
    backgroundColor="#f5f5f5"
    foregroundColor="#dbdbdb"
    className="mt-3"
    {...props}
  >
    <rect x="0" y="5" rx="5" ry="5" width="100%" height="100%" />
  </ContentLoader>
);

export default Loader;
