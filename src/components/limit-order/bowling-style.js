import { ButtonGroup, ToggleButton } from "react-bootstrap";

const BowlingStyle = ({ bowlingStyle, limit, setLimit, update = false }) => {
  return (
    <>
      <label className="input-title">BOWLING STYLE</label>
      <ButtonGroup className="d-block mb-3 mt-1 button-round-box">
        {bowlingStyle?.map((style, idx) => (
          <ToggleButton
            key={idx}
            id={`style-${idx}`}
            type="checkbox"
            variant="outline-dark"
            name="bowling_style"
            checked={limit?.bowling_style?.includes(style?.value)}
            onChange={() => {
              const info = [...limit?.bowling_style];
              const index = info.indexOf(style?.value);
              if (index !== -1) {
                info.splice(index, 1);
              } else {
                info.push(style?.value);
              }
              setLimit({ ...limit, bowling_style: info });
            }}
          >
            {style.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </>
  );
};

export default BowlingStyle;
