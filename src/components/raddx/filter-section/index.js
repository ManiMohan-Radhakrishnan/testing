import React, { useState } from "react";
import { BiCaretDown, BiX } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import { Dropdown } from "react-bootstrap";

import FILTERS from "./config";
import "./style.scss";

const FilterSection = ({
  onFilterChange = () => {},
  rentedFilterMethod = () => {},
  saleFilterMethod = () => {},
  saleFilter = false,
  rentedFilter = false,
  filteredNFTCount,
}) => {
  const [filter, setFilter] = useState(FILTERS);
  const [filtersApplied, setFiltersApplied] = useState(false);

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div
      className="badge badge-pill text-dark fs-6 border border-dark rounded-pill"
      ref={ref}
      role={"button"}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      <BiCaretDown className="ml-2" />
    </div>
  ));

  const CustomDropDownItems = (props) => {
    return (
      <Dropdown.Item
        as="button"
        color={"#000"}
        onClick={() => handleFilter(props, props?.filterKey)}
      >
        <FaCheckCircle
          fill={props.checked ? "#F47411" : "#ccc"}
          className="mb-1 me-2"
          size={17}
        />
        <span>{props?.name}</span>
      </Dropdown.Item>
    );
  };

  const CustomFilterPills = (props) => {
    return (
      <div className="badge badge-pill bg-secondary bg-opacity-75 text-dark fs-6 rounded-pill text-white bg-hover-dark">
        {props?.name}
        <BiX
          role="button"
          size={18}
          onClick={() => handleFilter(props, props?.filterKey, true)}
        />
      </div>
    );
  };

  const handleFilter = (input, type, remove = false) => {
    const info = { ...filter };

    let nft_category = [];
    let nft_collection = [];
    let car_category = [];
    let car_model = [];
    let body_surface = [];
    let nft_level = [];

    let filterArePresent = false;

    switch (type) {
      case "nft_category":
        info.categories = filter.categories.map((obj) => {
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

      case "nft_collection":
        info.subCategories = filter.subCategories.map((obj) => {
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
        info.landSubCategories = filter.landSubCategories.map((obj) => {
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
        info.buildingSubCategories = filter.buildingSubCategories.map((obj) => {
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
      case "car_category":
        info.carCategories = filter.carCategories.map((obj) => {
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
      case "car_model":
        info.carModels = filter.carModels.map((obj) => {
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
      case "body_surface":
        info.bodySurface = filter.bodySurface.map((obj) => {
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
      default:
    }

    info.categories.map((obj) => {
      if (obj?.checked === true) nft_category.push(obj?.value);
    });
    info.subCategories.map((obj) => {
      if (obj?.checked === true) nft_collection.push(obj?.value);
    });
    info.landSubCategories.map((obj) => {
      if (obj?.checked === true) nft_collection.push(obj?.value);
    });
    info.buildingSubCategories.map((obj) => {
      if (obj?.checked === true) nft_collection.push(obj?.value);
    });
    info.carCategories.map((obj) => {
      if (obj?.checked === true) car_category.push(obj?.value);
    });
    info.carModels.map((obj) => {
      if (obj?.checked === true) car_model.push(obj?.value);
    });
    info.bodySurface.map((obj) => {
      if (obj?.checked === true) body_surface.push(obj?.value);
    });
    info.level.map((obj) => {
      if (obj?.checked === true) nft_level.push(obj?.value);
    });

    setFilter({ ...info });
    let page = 1;
    let disabledStatus;

    if (
      nft_category?.length > 0 ||
      nft_collection?.length > 0 ||
      car_category?.length > 0 ||
      car_model?.length > 0 ||
      body_surface?.length > 0 ||
      nft_level?.length > 0
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
      nft_category,
      nft_collection,
      car_category,
      car_model,
      body_surface,
      nft_level,
    };

    onFilterChange({ page, filters, disabledStatus, filterArePresent });
    if (rentedFilter)
      rentedFilterMethod({ page, filters, disabledStatus, filterArePresent });
    if (saleFilter) saleFilterMethod({ page, filters, filterArePresent });
  };

  return (
    <>
      <div className="d-flex gap-2 p-2 flex-wrap">
        <Dropdown autoClose={["inside", "outside"]}>
          <Dropdown.Toggle align="start" drop="start" as={CustomToggle}>
            Role
          </Dropdown.Toggle>
          <Dropdown.Menu align="start">
            {filter.categories.map((obj, i) => (
              <CustomDropDownItems key={`nft-${obj?.checked}-${i}`} {...obj} />
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown autoClose={["inside", "outside"]}>
          <Dropdown.Toggle align="start" drop="start" as={CustomToggle}>
            Car Categories
          </Dropdown.Toggle>
          <Dropdown.Menu align="start">
            {filter.carCategories.map((obj, i) => (
              <CustomDropDownItems key={`nft-${obj?.checked}-${i}`} {...obj} />
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown autoClose={["inside", "outside"]}>
          <Dropdown.Toggle align="start" drop="start" as={CustomToggle}>
            Car Sub Categories
          </Dropdown.Toggle>
          <Dropdown.Menu align="start">
            {filter.subCategories.map((obj, i) => (
              <CustomDropDownItems key={`nft-${obj?.checked}-${i}`} {...obj} />
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown autoClose={["inside", "outside"]}>
          <Dropdown.Toggle align="start" drop="start" as={CustomToggle}>
            Land Sub Categories
          </Dropdown.Toggle>
          <Dropdown.Menu align="start">
            {filter.landSubCategories.map((obj, i) => (
              <CustomDropDownItems key={`nft-${obj?.checked}-${i}`} {...obj} />
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown autoClose={["inside", "outside"]}>
          <Dropdown.Toggle align="start" drop="start" as={CustomToggle}>
            Building Sub Categories
          </Dropdown.Toggle>
          <Dropdown.Menu align="start">
            {filter.buildingSubCategories.map((obj, i) => (
              <CustomDropDownItems key={`nft-${obj?.checked}-${i}`} {...obj} />
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown autoClose={["inside", "outside"]}>
          <Dropdown.Toggle align="start" drop="start" as={CustomToggle}>
            Car Models
          </Dropdown.Toggle>
          <Dropdown.Menu align="start">
            {filter.carModels.map((obj, i) => (
              <CustomDropDownItems key={`nft-${obj?.checked}-${i}`} {...obj} />
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown autoClose={["inside", "outside"]}>
          <Dropdown.Toggle align="start" drop="start" as={CustomToggle}>
            Body Surface
          </Dropdown.Toggle>
          <Dropdown.Menu align="start">
            {filter.bodySurface.map((obj, i) => (
              <CustomDropDownItems key={`nft-${obj?.checked}-${i}`} {...obj} />
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown autoClose={["inside", "outside"]}>
          <Dropdown.Toggle align="start" drop="start" as={CustomToggle}>
            Level
          </Dropdown.Toggle>
          <Dropdown.Menu align="start">
            {filter.level.map((obj, i) => (
              <CustomDropDownItems key={`nft-${obj?.checked}-${i}`} {...obj} />
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
          {Object.values(filter).map((f_value) => {
            if (!Array.isArray(f_value)) return <></>;
            return f_value
              .filter((xx) => xx?.checked === true)
              .map((obj, i) => (
                <CustomFilterPills key={`filter-pill-${i}`} {...obj} />
              ));
          })}
        </div>
      )}
    </>
  );
};

export default FilterSection;
