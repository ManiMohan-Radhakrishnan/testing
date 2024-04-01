import React, { useRef, useState } from "react";
import { BiCaretDown, BiX } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import { Dropdown } from "react-bootstrap";

const FilterSection = ({
  onFilterChange = () => {},
  rentedFilterMethod = () => {},
  saleFilterMethod = () => {},
  saleFilter = false,
  rentedFilter = false,
  filteredNFTCount,
}) => {
  const [filtersApplied, setFiltersApplied] = useState(false);
  const saleStatus = useRef(null);

  const [filter, setFilter] = useState({
    owned: [
      // { name: "All", value: "all", checked: false },
      { name: "Listed on sale", value: "onsale", checked: false },
      { name: "Not on sale", value: "not_on_sale", checked: false },
    ],
    category: [
      { name: "Batsman", value: "Batsman", checked: false },
      { name: "Bowler", value: "Bowler", checked: false },
      { name: "Bat", value: "Bat", checked: false },
      { name: "Shot", value: "Shot", checked: false },
      { name: "Fusor", value: "Fusor", checked: false },
      { name: "Fielder", value: "Fielder", checked: false },
      { name: "Ball", value: "Ball", checked: false },
    ],
    rentalCategory: [
      { name: "Batsman", value: "Batsman", checked: false },
      { name: "Bowler", value: "Bowler", checked: false },
      { name: "Bat", value: "Bat", checked: false },
    ],
    nftCollection: [
      {
        name: "Rare",
        value: "RARE",
        checked: false,
      },
      {
        name: "Rookie",
        value: "ROOKIE",
        checked: false,
      },
      {
        name: "Epic",
        value: "EPIC",
        checked: false,
      },
      {
        name: "Legend",
        value: "LEGEND",
        checked: false,
      },
      {
        name: "Ultra Legend",
        value: "ULTRA LEGEND",
        checked: false,
      },
      {
        name: "Immortal",
        value: "IMMORTAL",
        checked: false,
      },
      // {
      //   name: "Super Rare",
      //   value: "SUPER RARE",
      //   checked: false,
      // },
      // {
      //   name: "Ultra Rare",
      //   value: "ULTRA RARE",
      //   checked: false,
      // },
      // {
      //   name: "Immortal",
      //   value: "IMMORTAL",
      //   checked: false,
      // },
      // {
      //   name: "Unique",
      //   value: "UNIQUE",
      //   checked: false,
      // },
      // {
      //   name: "Premium",
      //   value: "PREMIUM",
      //   checked: false,
      // },
      // {
      //   name: "Superior",
      //   value: "SUPERIOR",
      //   checked: false,
      // },
      // {
      //   name: "Standard",
      //   value: "STANDARD",
      //   checked: false,
      // },
    ],
    batTypes: [
      {
        name: "Dual Signed Immortal",
        value: "DualSignedImmortal",
        checked: false,
      },
      {
        name: "Single Signed Immortal",
        value: "SingleSignedImmortal",
        checked: false,
      },
      {
        name: "Dual Signed Ultra Rare",
        value: "DualSignedUltraRare",
        checked: false,
      },
      {
        name: "Dual Crypto Unique",
        value: "DualCryptoUnique",
        checked: false,
      },
      {
        name: "Single Signed Ultra Rare",
        value: "SingleSignedUltraRare",
        checked: false,
      },
      {
        name: "Single Crypto Unique",
        value: "SingleCryptoUnique",
        checked: false,
      },
      {
        name: "Single Crypto Premium",
        value: "SingleCryptoPremium",
        checked: false,
      },
      {
        name: "Single Signed Super Rare",
        value: "SingleSignedSuperRare",
        checked: false,
      },
      {
        name: "Single Crypto Superior",
        value: "SingleCryptoSuperior",
        checked: false,
      },
      {
        name: "Single Signed Rare",
        value: "SingleSignedRare",
        checked: false,
      },
      {
        name: "Single Crypto Standard",
        value: "SingleCryptoStandard",
        checked: false,
      },
    ],
  });

  const saleTypeDropdown = React.forwardRef(({ onClick }, ref) => (
    <div
      className="badge badge-pill text-dark fs-6 border border-dark rounded-pill"
      ref={ref}
      role={"button"}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      Sale Type
      <BiCaretDown className="ml-2" />
    </div>
  ));

  const nftCategoryDropDown = React.forwardRef(({ onClick }, ref) => (
    <div
      className="badge badge-pill text-dark fs-6 border border-dark rounded-pill"
      ref={ref}
      role={"button"}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      Role
      <BiCaretDown fill={"#000"} className="ml-2" />
    </div>
  ));

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
      Category
      <BiCaretDown fill={"#000"} className="ml-2" />
    </div>
  ));

  const nftBatTypeDropDown = React.forwardRef(({ onClick }, ref) => (
    <div
      className="badge badge-pill text-dark fs-6 border border-dark rounded-pill"
      ref={ref}
      role={"button"}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      Bat Type
      <BiCaretDown fill={"#000"} className="ml-2" />
    </div>
  ));

  const handleFilter = (input, type, remove = false) => {
    const info = { ...filter };
    let sale_kind = "";
    let nft_collection = [];
    let nft_category = [];
    let rental_category = [];
    let bat_types = [];

    let filterArePresent = false;

    switch (type) {
      case "owned":
        info.owned = filter.owned.map((obj) => {
          let checked = input?.value
            ? input?.value === obj.value && !obj.checked
            : false;
          if (checked) sale_kind = !remove ? input?.value : "all";

          sale_kind = !remove ? sale_kind : "";

          saleStatus.current = sale_kind;
          return {
            ...obj,
            checked,
          };
        });
        break;
      case "nft_category":
        info.category = filter.category.map((obj) => {
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
      case "rental_category":
        info.rentalCategory = filter.rentalCategory.map((obj) => {
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
      case "bat_types":
        info.batTypes = filter.batTypes.map((obj) => {
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
    info.category.map((obj) => {
      if (obj?.checked === true) nft_category.push(obj?.value);
    });
    info.rentalCategory.map((obj) => {
      if (obj?.checked === true) rental_category.push(obj?.value);
    });
    info.batTypes.map((obj) => {
      if (obj?.checked === true) bat_types.push(obj?.value);
    });
    setFilter({ ...info });
    let page = 1;
    let disabledStatus;
    // console.log(
    //   "gruyeugryer",
    //   nft_collection.length,
    //   nft_category.length,
    //   rental_category.length
    // );

    if (
      nft_collection.length > 0 ||
      nft_category.length > 0 ||
      rental_category.length > 0 ||
      bat_types.length > 0 ||
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
      nft_category: rentedFilter ? rental_category : nft_category,
      sale_kind: saleStatus.current,
      bat_types: bat_types,
    };
    onFilterChange({ page, filters, disabledStatus, filterArePresent });
    if (rentedFilter)
      rentedFilterMethod({ page, filters, disabledStatus, filterArePresent });
    if (saleFilter) saleFilterMethod({ page, filters, filterArePresent });
  };

  return (
    <>
      <div className="d-flex gap-2 p-2">
        {!saleFilter && !rentedFilter && (
          <>
            <Dropdown autoClose={["inside", "outside"]}>
              <Dropdown.Toggle
                align="start"
                drop="start"
                as={saleTypeDropdown}
              ></Dropdown.Toggle>

              <Dropdown.Menu align="start">
                {filter.owned.map((obj, i) => (
                  <Dropdown.Item
                    key={`nft-${obj?.checked}-${i}`}
                    as="button"
                    onClick={() => handleFilter(obj, "owned")}
                  >
                    <FaCheckCircle
                      fill={obj.checked ? "#F47411" : "#ccc"}
                      className="mb-1 me-2"
                      size={17}
                    />{" "}
                    <span>{obj?.name}</span>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </>
        )}

        <Dropdown autoClose={["inside", "outside"]}>
          <Dropdown.Toggle
            align="start"
            drop="start"
            as={nftCategoryDropDown}
          ></Dropdown.Toggle>

          <Dropdown.Menu align="start">
            {rentedFilter ? (
              <>
                {filter.rentalCategory.map((obj, i) => (
                  <Dropdown.Item
                    key={`nft-${obj?.checked}-${i}`}
                    as="button"
                    color={"#000"}
                    onClick={() => handleFilter(obj, "rental_category")}
                  >
                    <FaCheckCircle
                      fill={obj.checked ? "#F47411" : "#ccc"}
                      className="mb-1 me-2"
                      size={17}
                    />
                    <span>{obj?.name}</span>
                  </Dropdown.Item>
                ))}
              </>
            ) : (
              <>
                {" "}
                {filter.category.map((obj, i) => (
                  <Dropdown.Item
                    key={`nft-${obj?.checked}-${i}`}
                    as="button"
                    color={"#000"}
                    onClick={() => handleFilter(obj, "nft_category")}
                  >
                    <FaCheckCircle
                      fill={obj.checked ? "#F47411" : "#ccc"}
                      className="mb-1 me-2"
                      size={17}
                    />
                    <span>{obj?.name}</span>
                  </Dropdown.Item>
                ))}
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown autoClose={["inside", "outside"]}>
          <Dropdown.Toggle
            align="start"
            drop="start"
            as={nftCollectionDropDown}
          ></Dropdown.Toggle>

          <Dropdown.Menu align="start">
            {filter.nftCollection.map((obj, i) => (
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
            as={nftBatTypeDropDown}
          ></Dropdown.Toggle>

          <Dropdown.Menu align="start">
            {filter.batTypes.map((obj, i) => (
              <Dropdown.Item
                key={`nft-${obj?.checked}-${i}`}
                as="button"
                color={"#000"}
                onClick={() => handleFilter(obj, "bat_types")}
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

          {filter.owned
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
            ))}

          {filter.nftCollection
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

          {filter.batTypes
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
                  onClick={() => handleFilter(obj, "bat_types", true)}
                />
              </div>
            ))}
          {rentedFilter
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
                ))}
        </div>
      )}
    </>
  );
};

export default FilterSection;
