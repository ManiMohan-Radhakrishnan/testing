import Select from "react-select";

const SignedBy = ({ signedByOptions, limit, setLimit, update = false }) => {
  return (
    <>
      <label className="input-title">SIGNED BY</label>
      <Select
        isMulti
        name="signed_by"
        defaultValue={signedByOptions?.filter((v) =>
          limit?.signed_by?.includes(v?.value)
        )}
        options={signedByOptions}
        className="basic-multi-select d-block mb-3 mt-1"
        classNamePrefix="select"
        onChange={(e) => {
          let info = [];
          e?.map((obj) => info.push(obj.value));
          setLimit({
            ...limit,
            signed_by: info,
          });
        }}
      />
    </>
  );
};

export default SignedBy;
