import { ButtonGroup, ToggleButton } from "react-bootstrap";

const Gender = ({ genders, limit, setLimit, update = false }) => {
  return (
    <>
      <label className="input-title">GENDER</label>
      <ButtonGroup className="d-block mb-3 mt-1 button-round-box">
        {genders?.map((gender, idx) => (
          <ToggleButton
            key={idx}
            id={`gender-${idx}`}
            type="checkbox"
            variant="outline-dark"
            name="gender"
            checked={limit?.gender?.includes(gender?.value)}
            onChange={() => {
              const info = [...limit?.gender];
              const index = info.indexOf(gender?.value);
              if (index !== -1) {
                info.splice(index, 1);
              } else {
                info.push(gender?.value);
              }
              setLimit({ ...limit, gender: info });
            }}
          >
            {gender.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </>
  );
};

export default Gender;
