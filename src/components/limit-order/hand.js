import { ButtonGroup, ToggleButton } from "react-bootstrap";

const Hand = ({ hand, limit, setLimit, update = false }) => {
  return (
    <>
      <label className="input-title">DOMINANT HAND</label>
      <ButtonGroup className="d-block mb-3 mt-1 button-round-box">
        {hand?.map((dominant, idx) => (
          <ToggleButton
            key={idx}
            id={`dominant-${idx}`}
            type="checkbox"
            variant="outline-dark"
            name="dominant"
            checked={limit?.dominant_hand?.includes(dominant?.value)}
            onChange={() => {
              const info = [...limit?.dominant_hand];
              const index = info.indexOf(dominant?.value);
              if (index !== -1) {
                info.splice(index, 1);
              } else {
                info.push(dominant?.value);
              }
              setLimit({ ...limit, dominant_hand: info });
            }}
          >
            {dominant.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </>
  );
};

export default Hand;
