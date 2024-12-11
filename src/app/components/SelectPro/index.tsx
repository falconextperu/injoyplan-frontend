import { useEffect, useState } from "react";
import Input from "../Input";
import Svg from "../Svg";
import { Icons } from "../Svg/iconsPack";
import styles from "./select.module.css";
import useOutsideClick from "./../../hooks/useOutsideClick";
import { motion } from "framer-motion";
import useDebounce from "./../../hooks/useDebounce";

interface IProps {
  options?: IOption[] | any;
  onChange: any;
  handleGetData?: Function;
  isLabel?: boolean;
  isIconLeft?: boolean;
  isSave?: boolean
  isSearch?: boolean;
  value?: string;
  placeholder?: string;
  optionSelect?: boolean;
  name?: string;
  onKeyDown?: any;
  autofocus?: boolean
  position?: "left" | "right" | "bottom" | "top";
  withLabel?: boolean;
  label?: string;
  defaultValue?: any;
  motivoForm?: any;
  reload?: any;
  disabled?: boolean;
  id?: string;
  setIsClear?: any;
  isClear?: boolean;
  longTextSearch?: number;
  extraClass?: string;
}

interface IOption {
  id: number;
  value: string;
}

const SelectPro = ({
  motivoForm,
  isIconLeft,
  isSave,
  options,
  autofocus,
  onChange,
  handleGetData,
  isSearch,
  position = "bottom",
  placeholder,
  withLabel,
  name,
  label,
  defaultValue,
  disabled,
  setIsClear,
  isClear = false,
  id,
  longTextSearch = 2,
  extraClass = ""
}: IProps) => {
  const [, setShowOptions] = useState(false);
  const [valueOptions, setValueOptions] = useState<string>(defaultValue);
  const [optionSearch, setOptionsSearch] = useState<any>([]);
  const [isOpen, setIsOpen, ref] = useOutsideClick(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [searching] = useState(isSearch);
  const [querySearch, setQuerySeach] = useState<string>("");
  const debounceSearch = useDebounce(querySearch, 350);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(-1);


  useEffect(() => {
    if (defaultValue === "") {
      return setValueOptions(defaultValue);
    } else {
      return setValueOptions(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (motivoForm === "") {
      return setValueOptions(defaultValue);
    }
  }, [motivoForm]);

  const setValueOption = (item: IOption, name: any, id: any) => {
    let div: any = ref.current;
    let inputHtml: any = div.querySelector("input");

    // @ts-ignore (us this comment if typescript raises an error)
    ref.current.firstChild.firstChild.value = "";
    setValueOptions(item.value);
    inputHtml.value = "";
    onChange(item.id, item.value, name, id);
    setIsOpen(false);
    () => setIsClear(false);
  };

  const searchOptions = (e: any) => {
    setValueOptions("");
    setShowOptions(true);
    if (isSave) {
      onChange(null, e.target.value, null);
    }
    const value = e.target.value;
    if (handleGetData) {
      if (value.length >= longTextSearch) {
        setQuerySeach(value);
        return;
      }
    }
    setSearch(value);
  };

  const scrollToSelectedOption = () => {
    if (selectedOptionIndex >= 0) {
      const optionElement = document.querySelector(`#option-${selectedOptionIndex}`);
      if (optionElement) {
        optionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
      setSelectedOptionIndex(prevIndex => {
        const newIndex = Math.min(prevIndex + 1, resultsOptions.length - 1);
        scrollToSelectedOption();
        return newIndex;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedOptionIndex(prevIndex => {
        const newIndex = Math.max(prevIndex - 1, -1);
        scrollToSelectedOption();
        return newIndex;
      });
    } else if (e.key === "Enter" && selectedOptionIndex >= 0) {
      e.preventDefault();
      setValueOption(resultsOptions[selectedOptionIndex], name, id);
    }
  }

  useEffect(() => {
    if (handleGetData && (debounceSearch.length >= longTextSearch)) {
      setIsLoading(true);
      handleGetData(debounceSearch, () => setIsLoading(false));
    }
  }, [debounceSearch]);

  useEffect(() => {
    if (options?.length > 0) {
      const results = options?.map((item: any) => ({
        id: item?.id?.toString(),
        value: item?.value,
      }));
      setOptionsSearch(results);
    } else {
      setOptionsSearch([]);
    }
  }, [options]);

  useEffect(() => {
    if (isClear) {
      setValueOptions("")
    }
  }, [isClear])

  const resultsOptions: any = !search
    ? optionSearch
    : optionSearch?.filter(
      (option: any) =>
        ((typeof option.id === "string" ||
          typeof option.value === "string") &&
          option?.id?.toLowerCase().includes(search.toLocaleLowerCase())) ||
        option?.value?.toLowerCase().includes(search.toLocaleLowerCase())
    );

  const optionsHeigth: any = {
    height: resultsOptions && resultsOptions.length > 10 ? "215px" : "auto",
    filter: "blur(-1px)",
  };

  const handleInputClick = () => {
    if (disabled) return
    let div: any = ref.current;
    let inputHtml: any = div.querySelector("input");
    inputHtml.focus();
  };

  const getClassPosition = (position: string, label: string = "") => {
    const positions: any = {
      left: styles.positionLeft,
      right: styles.positionRight,
      bottom: label !== "" ? styles.positionBottomWithLabel : styles.positionBottom,
      top: label !== "" ? styles.positionTopWithLabel : styles.positionTop
    }
    return positions[position] || ""
  }

  console.log(valueOptions)

  return (
    <>
      <div ref={ref} className={`${styles.wrapper__select} ${extraClass}`}>
        <div
        onClick={() => setIsOpen(!isOpen)}
          className={
            `${disabled
              ? `${styles.input__select} ${styles.disabled__select}`
              : `${styles.input__select}`
            }
           
           `
          }
        >
          <div className={styles.selected__value}>
            {!isClear ? (
              valueOptions && <span onClick={handleInputClick}>{valueOptions}</span>
            ) : (
              <span>{""}</span>
            )}
            {/* {valueOptions && <span>{valueOptions}</span>} */}
          </div>
          <div>
            <Input
              onKeyDown={handleKeyDown}
              isLabel
              label={label}
              disabled={disabled}
              id="inputfocus"
              autoFocus={autofocus}
              readOnly={searching ? false : true}
              autocomplete="off"
              placeholder={valueOptions !== undefined ? "" : placeholder}
              onChange={searchOptions}
              onClick={() => setIsOpen(!isOpen)}
              name="option"
            />
          </div>
          {isLoading ? (
            <div className={styles.select__loader__container}>
              <span className={styles.select__loader__icon}></span>
            </div>
          ) : (
            <div>
              <div className={styles.select__marker}>
                <Svg
                  icon={Icons.arrowDown}
                  onClick={() => setIsOpen(!isOpen)}
                />
              </div>
              {
                isIconLeft === true && (
                  <div className={styles.select__arrow}>
                    <Svg
                      icon={Icons.marker}
                      onClick={() => setIsOpen(!isOpen)}
                    />
                  </div>
                )
              }
            </div>
          )}
        </div>

        {isOpen && (
          <motion.div
            style={optionsHeigth}
            className={`${styles.content__listOptions} ${getClassPosition(position, label)}`}
          >
            {resultsOptions && resultsOptions?.length > 0 ? (
              resultsOptions?.map((item: IOption, index: number) => (
                <motion.div
                key={index}>
                  <li id={`option-${index}`}
                    className={index === selectedOptionIndex ? `${styles.selected} ? ${styles.selectedOption}` : ''}

                  >
                    <p
                      onClick={() => {
                        setValueOption(item, name, id);
                      }}
                    >
                      {" "}
                      {withLabel && item?.id + "-"}
                      {item.value}{" "}
                    </p>
                  </li>
                </motion.div>
              ))
            ) : (
              <div className={styles.content__noResults__Select}>
                <p>No se encontraron más resultados</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </>
  );
};

export default SelectPro;
