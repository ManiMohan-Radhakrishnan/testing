import React, { useState } from "react";
import { BiCaretDown, BiX } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import { Dropdown } from "react-bootstrap";

const HurleyFilterSection = ({
  onFilterChange = () => {},
  rentedFilterMethod = () => {},
  saleFilterMethod = () => {},
  saleFilter = false,
  rentedFilter = false,
  filteredNFTCount,
}) => {
  const [filtersApplied, setFiltersApplied] = useState(false);

  const [filter, setFilter] = useState({
    nftCollection: [
      {
        name: "Rare",
        value: "RARE",
        checked: false,
      },
      {
        name: "Epic",
        value: "EPIC",
        checked: false,
      },
      {
        name: "Legendary",
        value: "LEGENDARY",
        checked: false,
      },
      {
        name: "Immortal",
        value: "IMMORTAL",
        checked: false,
      },
      {
        name: "Common",
        value: "COMMON",
        checked: false,
      },
      {
        name: "Uncommon",
        value: "UNCOMMON",
        checked: false,
      },
    ],
    level: [
      {
        name: "Level 1",
        value: "1",
        checked: false,
        filterKey: "nft_level",
      },
      {
        name: "Level 2",
        value: "2",
        checked: false,
        filterKey: "nft_level",
      },
      {
        name: "Level 3",
        value: "3",
        checked: false,
        filterKey: "nft_level",
      },
      {
        name: "Level 4",
        value: "4",
        checked: false,
        filterKey: "nft_level",
      },
      {
        name: "Level 5",
        value: "5",
        checked: false,
        filterKey: "nft_level",
      },
      {
        name: "Level 6",
        value: "6",
        checked: false,
        filterKey: "nft_level",
      },
      {
        name: "Level 7",
        value: "7",
        checked: false,
        filterKey: "nft_level",
      },
      {
        name: "Level 8",
        value: "8",
        checked: false,
        filterKey: "nft_level",
      },
      {
        name: "Level 9",
        value: "9",
        checked: false,
        filterKey: "nft_level",
      },
      {
        name: "Level 10",
        value: "10",
        checked: false,
        filterKey: "nft_level",
      },
    ],
    gender: [
      {
        name: "Reef",
        value: "Male",
        checked: false,
      },
      {
        name: "Sandy",
        value: "Female",
        checked: false,
      },
    ],
  });

  const nftCollectionDropDown = React.forwardRef(({ onClick }, ref) => (
    <div
      className="badge badge-pill text-dark fs-6 border border-dark rounded-pill"
      ref={ref}
      role={"button"}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      Categories
      <BiCaretDown fill={"#000"} className="ml-2" />
    </div>
  ));

  const nftGenderDropDown = React.forwardRef(({ onClick }, ref) => (
    <div
      className="badge badge-pill text-dark fs-6 border border-dark rounded-pill"
      ref={ref}
      role={"button"}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      Gender
      <BiCaretDown fill={"#000"} className="ml-2" />
    </div>
  ));

  const nftLevelTypeDropDown = React.forwardRef(({ onClick }, ref) => (
    <div
      className="badge badge-pill text-dark fs-6 border border-dark rounded-pill"
      ref={ref}
      role={"button"}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      Level
      <BiCaretDown fill={"#000"} className="ml-2" />
    </div>
  ));

  const handleFilter = (input, type, remove = false) => {
    const info = { ...filter };
    // let sale_kind = "";
    let nft_collection = [];
    let nft_level = [];
    let gender = [];
    // let rental_category = [];
    // let bat_types = [];

    let filterArePresent = false;

    switch (type) {
      // case "owned":
      //   info.owned = filter.owned.map((obj) => {
      //     let checked = input?.value
      //       ? input?.value === obj.value && !obj.checked
      //       : false;
      //     if (checked) sale_kind = !remove ? input?.value : "all";
      //     sale_kind = !remove ? sale_kind : "";
      //     return {
      //       ...obj,
      //       checked,
      //     };
      //   });
      //   break;
      // case "nft_category":
      //   info.category = filter.category.map((obj) => {
      //     let checked = input?.value
      //       ? input?.value === obj?.value
      //         ? !obj?.checked && !remove
      //         : obj?.checked
      //       : obj?.checked;
      //     return {
      //       ...obj,
      //       checked,
      //     };
      //   });
      //   break;
      // case "rental_category":
      //   info.rentalCategory = filter.rentalCategory.map((obj) => {
      //     let checked = input?.value
      //       ? input?.value === obj?.value
      //         ? !obj?.checked && !remove
      //         : obj?.checked
      //       : obj?.checked;
      //     return {
      //       ...obj,
      //       checked,
      //     };
      //   });
      case "nft_collection":
        info.nftCollection = filter.nftCollection.map((obj) => {
          let checked = input?.value
            ? input?.value === obj?.value
              ? !obj?.checked && !remove
              : obj?.checked
            : obj?.checked;
          return {
            ...obj,
            checked,
          };
        });
        break;

      case "nft_gender":
        info.gender = filter.gender.map((obj) => {
          let checked = input?.value
            ? input?.value === obj?.value
              ? !obj?.checked && !remove
              : obj?.checked
            : obj?.checked;
          return {
            ...obj,
            checked,
          };
        });
      case "nft_level":
        info.level = filter.level.map((obj) => {
          let checked = input?.value
            ? input?.value === obj?.value
              ? !obj?.checked && !remove
              : obj?.checked
            : obj?.checked;
          return {
            ...obj,
            checked,
          };
        });
        break;
      default:
    }

    info.nftCollection.map((obj) => {
      if (obj?.checked === true) nft_collection.push(obj?.value);
    });
    info.level.map((obj) => {
      if (obj?.checked === true) nft_level.push(obj?.value);
    });
    info.gender.map((obj) => {
      if (obj?.checked === true) gender.push(obj?.value);
    });
    // info.category.map((obj) => {
    //   if (obj?.checked === true) nft_category.push(obj?.value);
    // });
    // info.rentalCategory.map((obj) => {
    //   if (obj?.checked === true) rental_category.push(obj?.value);
    // });
    // info.batTypes.map((obj) => {
    //   if (obj?.checked === true) bat_types.push(obj?.value);
    // });
    setFilter({ ...info });
    let page = 1;
    let disabledStatus;

    if (
      nft_collection.length > 0 ||
      nft_level.length > 0 ||
      gender.length > 0 ||
      // rental_category.length > 0 ||
      // bat_types.length > 0 ||
      // sale_kind === "onsale" ||
      // sale_kind === "not_on_sale" ||
      info?.owned?.some((o) => o.checked === true)
    ) {
      setFiltersApplied(true);
      filterArePresent = true;
      disabledStatus = true;
    } else {
      setFiltersApplied(false);
      filterArePresent = false;
      disabledStatus = false;
    }

    let filters = {
      nft_collection: nft_collection,
      nft_level: nft_level,
      gender: gender,
      // nft_category: nft_category,
      // nft_category: rentedFilter ? rental_category : nft_category,
      // sale_kind: sale_kind,
      // bat_types: bat_types,
    };
    onFilterChange({ page, filters, disabledStatus, filterArePresent });
    if (rentedFilter)
      rentedFilterMethod({ page, filters, disabledStatus, filterArePresent });
    if (saleFilter) saleFilterMethod({ page, filters, filterArePresent });
  };

  return (
    <>
      <div className="d-flex gap-2 p-2">
        <Dropdown autoClose={["inside", "outside"]}>
          <Dropdown.Toggle
            align="start"
            drop="start"
            as={nftCollectionDropDown}
          ></Dropdown.Toggle>

          <Dropdown.Menu align="start">
            {filter?.nftCollection.map((obj, i) => (
              <Dropdown.Item
                key={`nft-${obj?.checked}-${i}`}
                as="button"
                color={"#000"}
                onClick={() => handleFilter(obj, "nft_collection")}
              >
                <FaCheckCircle
                  fill={obj.checked ? "#F47411" : "#ccc"}
                  className="mb-1 me-2"
                  size={17}
                />
                <span>{obj?.name}</span>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown autoClose={["inside", "outside"]}>
          <Dropdown.Toggle
            align="start"
            drop="start"
            as={nftGenderDropDown}
          ></Dropdown.Toggle>

          <Dropdown.Menu align="start">
            {filter.gender.map((obj, i) => (
              <Dropdown.Item
                key={`nft-${obj?.checked}-${i}`}
                as="button"
                color={"#000"}
                onClick={() => handleFilter(obj, "nft_gender")}
              >
                <FaCheckCircle
                  fill={obj.checked ? "#F47411" : "#ccc"}
                  className="mb-1 me-2"
                  size={17}
                />
                <span>{obj?.name}</span>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown autoClose={["inside", "outside"]}>
          <Dropdown.Toggle
            align="start"
            drop="start"
            as={nftLevelTypeDropDown}
          ></Dropdown.Toggle>

          <Dropdown.Menu align="start">
            {filter.level.map((obj, i) => (
              <Dropdown.Item
                key={`nft-${obj?.checked}-${i}`}
                as="button"
                color={"#000"}
                onClick={() => handleFilter(obj, "nft_level")}
              >
                <FaCheckCircle
                  fill={obj.checked ? "#F47411" : "#ccc"}
                  className="mb-1 me-2"
                  size={17}
                />
                <span>{obj?.name}</span>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {filtersApplied && (
        <div className="w-100 d-flex gap-2 p-2 mb-3 flex-wrap">
          {filtersApplied && filteredNFTCount !== 0 && (
            <div className="d-flex align-items-center text-dark fs-6 fw-bold">
              {`Filtered NFTs (${filteredNFTCount})`}
            </div>
          )}

          {/* {filter?.owned
            .filter((xx) => xx?.checked === true)
            .map((obj, i) => (
              <div
                key={`filter-pill${i}`}
                className="badge badge-pill bg-secondary bg-opacity-75 text-dark fs-6 rounded-pill text-white bg-hover-dark"
              >
                {obj?.name}
                <BiX
                  role="button"
                  size={18}
                  onClick={() => handleFilter(obj, "owned", true)}
                />
              </div>
            ))} */}

          {filter?.nftCollection
            .filter((xx) => xx?.checked === true)
            .map((obj, i) => (
              <div
                key={`filter-pill${i}`}
                role={"button"}
                className="badge badge-pill bg-secondary bg-opacity-75 text-dark fs-6 rounded-pill text-white bg-hover-dark"
              >
                {obj?.name}
                <BiX
                  role="button"
                  size={18}
                  onClick={() => handleFilter(obj, "nft_collection", true)}
                />
              </div>
            ))}

          {filter?.gender
            .filter((xx) => xx?.checked === true)
            .map((obj, i) => (
              <div
                key={`filter-pill${i}`}
                role={"button"}
                className="badge badge-pill bg-secondary bg-opacity-75 text-dark fs-6 rounded-pill text-white bg-hover-dark"
              >
                {obj?.name}
                <BiX
                  role="button"
                  size={18}
                  onClick={() => handleFilter(obj, "nft_gender", true)}
                />
              </div>
            ))}

          {filter?.level
            .filter((xx) => xx?.checked === true)
            .map((obj, i) => (
              <div
                key={`filter-pill${i}`}
                role={"button"}
                className="badge badge-pill bg-secondary bg-opacity-75 text-dark fs-6 rounded-pill text-white bg-hover-dark"
              >
                {obj?.name}
                <BiX
                  role="button"
                  size={18}
                  onClick={() => handleFilter(obj, "nft_level", true)}
                />
              </div>
            ))}
          {/* {rentedFilter
            ? filter.rentalCategory
                .filter((xx) => xx?.checked === true)
                .map((obj, i) => (
                  <div
                    key={`filter-pill${i}`}
                    role={"button"}
                    className="badge badge-pill bg-secondary bg-opacity-75 text-dark fs-6 rounded-pill text-white bg-hover-dark"
                  >
                    {obj?.name}
                    <BiX
                      role="button"
                      size={18}
                      onClick={() => handleFilter(obj, "rental_category", true)}
                    />
                  </div>
                ))
            : filter.category
                .filter((xx) => xx?.checked === true)
                .map((obj, i) => (
                  <div
                    key={`filter-pill${i}`}
                    role={"button"}
                    className="badge badge-pill bg-secondary bg-opacity-75 text-dark fs-6 rounded-pill text-white bg-hover-dark"
                  >
                    {obj?.name}
                    <BiX
                      role="button"
                      size={18}
                      onClick={() => handleFilter(obj, "nft_category", true)}
                    />
                  </div>
                ))} */}
        </div>
      )}
    </>
  );
};

export default HurleyFilterSection;
