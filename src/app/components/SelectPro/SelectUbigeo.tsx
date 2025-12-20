import { useEffect, useState } from 'react';
import { CSSProperties } from 'styled-components';
import useOutsideClick from "../../hooks/useOutsideClick";
import Input from '../Input';
import Svg from '../Svg';
import { Icons } from '../Svg/iconsPack';
import styles from './select.module.css';
import { motion } from 'framer-motion';

interface IProps {
    options: IUbigeum[]
    onChange: any
    isLabel?: boolean
    isSearch?: boolean
    value?: string
    placeholder?: string
    menuLeft?: boolean
    optionSelect?: boolean
    disabled?: boolean
    name: string
    id?: string
    setNameSelect?: any
    setLabel?: any
    withLabel?: boolean
    label?: string
    defaultValue?: string
}

interface IUbigeum {
    id: number
    nombreDepartamento: string
    nombreDistrito: string
    nombreProvincia: string
    estado: boolean
    codigoDepartamento: string
    codigoDistrito: string
    codigoProvincia: string
}

const SelectUbigeo = ({
    options,
    isSearch,
    disabled,
    label,
    placeholder,
    id,
    name,
    onChange,
    defaultValue
}: IProps) => {

    const [, setShowOptions] = useState(false);
    const [valueOptions, setValueOptions] = useState<string | any>(defaultValue);
    const [search, setSearch] = useState("");
    const [searching, ] = useState(!isSearch);
    const [isOpen, setIsOpen, ref] = useOutsideClick(false);

    useEffect(() => {
        if (defaultValue === "") {
            return setValueOptions(defaultValue);
        } else {
            return setValueOptions(defaultValue);
        }
    }, [defaultValue])

    const heightDropdown: CSSProperties = {
        height: "170px"
    }

    const setValueOption = (item: IUbigeum, name: any, id: any) => {

        let div: any = ref.current;
        let inputHtml: any = div.querySelector('input')

        if (search) {
            // @ts-ignore (us this comment if typescript raises an error)
            ref.current.firstChild.firstChild.value = ""
            setValueOptions(`${item.nombreDepartamento}/${item.nombreProvincia}/${item.nombreDistrito}`);
            inputHtml.value = "";
            onChange(item.id, `${item.nombreDepartamento}/${item.nombreProvincia}/${item.nombreDistrito}`, name, id);
        } else {
            // @ts-ignore (us this comment if typescript raises an error)
            ref.current.firstChild.firstChild.value = ""
            inputHtml.value = "";
            setValueOptions(`${item.nombreDepartamento}/${item.nombreProvincia}/${item.nombreDistrito}`);
            onChange(item.id, `${item.nombreDepartamento}/${item.nombreProvincia}/${item.nombreDistrito}`, name, id);
        }

        setIsOpen(false);
    }

    const results = !search ? options : options.filter((option: IUbigeum) => (typeof option.nombreDepartamento === "string") && `${option.nombreDepartamento}/${option.nombreProvincia}/${option.nombreDistrito}`.toLowerCase().includes(search.toLocaleLowerCase()))

    const searchOptions = (e: any) => {
        setValueOptions("");
        setShowOptions(true)
        setSearch(e.target.value);
    }

    return (
        <>
            <div ref={ref} className={styles.wrapper__select}>
                <div className={disabled ? `${styles.input__select} ${styles.disabled__select}` : `${styles.input__select}`} onClick={() => setIsOpen(!isOpen)}>
                    <div className={styles.selected__value}>
                        {valueOptions && <span>{valueOptions}</span>}
                    </div>
                    <div>
                        <Input isLabel label={label} readOnly={searching ? true : false} autocomplete="off" placeholder={placeholder} onChange={searchOptions} name="option"
                        />
                    </div>
                    <div className={styles.select__arrow}>
                        <Svg icon={Icons.arrowSelect} onClick={() => setIsOpen(!isOpen)} />
                    </div>
                </div>

                {isOpen && (
                    <motion.div
                    {...({
                        style: heightDropdown,
                        className: styles.content__listOptions
                    } as any)}
                    >
                        {
                            results && results.length > 0 && results.map((item: IUbigeum) => (
                                <li key={item.id} onClick={() => {
                                    setValueOption(item, name, id)
                                }}>
                                    <p>{`${item.nombreDepartamento}/${item.nombreProvincia}/${item.nombreDistrito}`}</p>
                                </li>
                            ))
                        }
                    </motion.div>
                )}

            </div>

        </>
    )
}

export default SelectUbigeo;