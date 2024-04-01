import { ButtonGroup, ToggleButton } from "react-bootstrap";

const Category = ({ categories, limit, setLimit, update = false }) => {
  return (
    <>
      <label className="input-title">CATEGORY</label>
      <ButtonGroup className="d-block mb-3 mt-1 button-round-box">
        {categories?.map((category, idx) => (
          <ToggleButton
            key={idx}
            id={`category-${idx}`}
            type="checkbox"
            variant="outline-dark"
            name="category"
            checked={limit?.category?.includes(category.value)}
            onChange={() => {
              const info = [...limit?.category];
              const bat_cat = [...limit?.bat_category];
              const index = info.indexOf(category?.value);
              const index1 = bat_cat.indexOf(category?.key);
              if (index !== -1) {
                info.splice(index, 1);
              } else {
                info.push(category?.value);
              }
              if (index1 !== -1) {
                bat_cat.splice(index1, 1);
              } else {
                bat_cat.push(category?.key);
              }
              setLimit({ ...limit, category: info, bat_category: bat_cat });
            }}
          >
            {category.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
    </>
  );
};

export default Category;
