import { useEffect, useReducer, Fragment } from "react";
import { assert } from "keycloakify/tools/assert";
import type { KcClsx } from "keycloakify/login/lib/kcClsx";
import {
    useUserProfileForm,
    getButtonToDisplayForMultivaluedAttributeField,
    type FormAction,
    type FormFieldError
} from "keycloakify/login/lib/useUserProfileForm";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { Attribute } from "keycloakify/login/KcContext";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";

export default function UserProfileFormFields(props: UserProfileFormFieldsProps<KcContext, I18n>) {
    const { kcContext, i18n, kcClsx, onIsFormSubmittableValueChange, doMakeUserConfirmPassword, BeforeField, AfterField } = props;

    const { advancedMsg } = i18n;

    const {
        formState: { formFieldStates, isFormSubmittable },
        dispatchFormAction
    } = useUserProfileForm({
        kcContext,
        i18n,
        doMakeUserConfirmPassword
    });

    useEffect(() => {
        onIsFormSubmittableValueChange(isFormSubmittable);
    }, [isFormSubmittable]);

    const groupNameRef = { current: "" };

    return (
        <>
            {formFieldStates.map(({ attribute, displayableErrors, valueOrValues }) => {
                const isHidden =
                    attribute.annotations.inputType === "hidden" || (attribute.name === "password-confirm" && !doMakeUserConfirmPassword);

                const isSingleTextLike =
                    !attribute.annotations.inputType ||
                    attribute.annotations.inputType === "text" ||
                    attribute.annotations.inputType.startsWith("html5-");

                const useFloatingLabel = isSingleTextLike && !(valueOrValues instanceof Array);

                return (
                    <Fragment key={attribute.name}>
                        <GroupLabel attribute={attribute} groupNameRef={groupNameRef} i18n={i18n} kcClsx={kcClsx} />
                        {BeforeField !== undefined && (
                            <BeforeField
                                attribute={attribute}
                                dispatchFormAction={dispatchFormAction}
                                displayableErrors={displayableErrors}
                                valueOrValues={valueOrValues}
                                kcClsx={kcClsx}
                                i18n={i18n}
                            />
                        )}
                        <div
                            className="mb-6"
                            style={{
                                display: isHidden ? "none" : undefined
                            }}
                        >
                            {!useFloatingLabel && (
                                <div className="mb-1.5">
                                    <label htmlFor={attribute.name} className="text-sm font-semibold text-[#172b4d]">
                                        {advancedMsg(attribute.displayName ?? "")}
                                    </label>
                                    {attribute.required && <span className="text-red-900 font-bold ml-0.5">*</span>}
                                </div>
                            )}
                            <div>
                                {attribute.annotations.inputHelperTextBefore !== undefined && (
                                    <div
                                        className="text-xs text-[#172b4d]/85 mb-1.5"
                                        id={`form-help-text-before-${attribute.name}`}
                                        aria-live="polite"
                                    >
                                        {advancedMsg(attribute.annotations.inputHelperTextBefore)}
                                    </div>
                                )}
                                <InputFieldByType
                                    attribute={attribute}
                                    valueOrValues={valueOrValues}
                                    displayableErrors={displayableErrors}
                                    dispatchFormAction={dispatchFormAction}
                                    kcClsx={kcClsx}
                                    i18n={i18n}
                                    useFloatingLabel={useFloatingLabel}
                                />
                                <FieldErrors attribute={attribute} displayableErrors={displayableErrors} kcClsx={kcClsx} fieldIndex={undefined} />
                                {attribute.annotations.inputHelperTextAfter !== undefined && (
                                    <div
                                        className="text-xs text-[#172b4d]/85 mt-1.5"
                                        id={`form-help-text-after-${attribute.name}`}
                                        aria-live="polite"
                                    >
                                        {advancedMsg(attribute.annotations.inputHelperTextAfter)}
                                    </div>
                                )}
                                {AfterField !== undefined && (
                                    <AfterField
                                        attribute={attribute}
                                        dispatchFormAction={dispatchFormAction}
                                        displayableErrors={displayableErrors}
                                        valueOrValues={valueOrValues}
                                        kcClsx={kcClsx}
                                        i18n={i18n}
                                    />
                                )}
                            </div>
                        </div>
                    </Fragment>
                );
            })}
        </>
    );
}

function GroupLabel(props: {
    attribute: Attribute;
    groupNameRef: {
        current: string;
    };
    i18n: I18n;
    kcClsx: KcClsx;
}) {
    const { attribute, groupNameRef, i18n } = props;
    const { advancedMsg } = i18n;

    if (attribute.group?.name !== groupNameRef.current) {
        groupNameRef.current = attribute.group?.name ?? "";

        if (groupNameRef.current !== "") {
            assert(attribute.group !== undefined);

            return (
                <div
                    className="mb-4 mt-2 border-b border-[#172b4d]/20 pb-1"
                    {...Object.fromEntries(Object.entries(attribute.group.html5DataAnnotations).map(([key, value]) => [`data-${key}`, value]))}
                >
                    {(() => {
                        const groupDisplayHeader = attribute.group.displayHeader ?? "";
                        const groupHeaderText = groupDisplayHeader !== "" ? advancedMsg(groupDisplayHeader) : attribute.group.name;

                        return (
                            <div>
                                <label id={`header-${attribute.group.name}`} className="text-base font-bold text-[#172b4d]">
                                    {groupHeaderText}
                                </label>
                            </div>
                        );
                    })()}
                    {(() => {
                        const groupDisplayDescription = attribute.group.displayDescription ?? "";

                        if (groupDisplayDescription !== "") {
                            const groupDescriptionText = advancedMsg(groupDisplayDescription);
                            return (
                                <div>
                                    <label id={`description-${attribute.group.name}`} className="text-xs text-[#172b4d]/80">
                                        {groupDescriptionText}
                                    </label>
                                </div>
                            );
                        }

                        return null;
                    })()}
                </div>
            );
        }
    }

    return null;
}

function FieldErrors(props: { attribute: Attribute; displayableErrors: FormFieldError[]; fieldIndex: number | undefined; kcClsx: KcClsx }) {
    const { attribute, fieldIndex } = props;

    const displayableErrors = props.displayableErrors.filter(error => error.fieldIndex === fieldIndex);

    if (displayableErrors.length === 0) {
        return null;
    }

    return (
        <div
            id={`input-error-${attribute.name}${fieldIndex === undefined ? "" : `-${fieldIndex}`}`}
            className="mt-2 flex items-start gap-2 rounded-md bg-[#1e355e]/95 px-3 py-2 text-xs font-medium text-red-100 border border-red-300/60 shadow-sm"
            aria-live="polite"
        >
            <i className="pi pi-exclamation-circle text-red-300 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
                {displayableErrors.map(({ errorMessage }, i, arr) => (
                    <Fragment key={i}>
                        {errorMessage}
                        {arr.length - 1 !== i && <br />}
                    </Fragment>
                ))}
            </span>
        </div>
    );
}

type InputFieldByTypeProps = {
    attribute: Attribute;
    valueOrValues: string | string[];
    displayableErrors: FormFieldError[];
    dispatchFormAction: React.Dispatch<FormAction>;
    i18n: I18n;
    kcClsx: KcClsx;
    useFloatingLabel?: boolean;
};

function InputFieldByType(props: InputFieldByTypeProps) {
    const { attribute, valueOrValues } = props;

    switch (attribute.annotations.inputType) {
        case "hidden":
            return <input type="hidden" name={attribute.name} value={valueOrValues} />;
        case "textarea":
            return <TextareaTag {...props} />;
        case "select":
        case "multiselect":
            return <SelectTag {...props} />;
        case "select-radiobuttons":
        case "multiselect-checkboxes":
            return <InputTagSelects {...props} />;
        default: {
            if (valueOrValues instanceof Array) {
                return (
                    <>
                        {valueOrValues.map((...[, i]) => (
                            <InputTag key={i} {...props} fieldIndex={i} />
                        ))}
                    </>
                );
            }

            if (attribute.name === "password" || attribute.name === "password-confirm") {
                return <PasswordInputTag {...props} />;
            }

            return <InputTag {...props} fieldIndex={undefined} />;
        }
    }
}

function PasswordInputTag(props: InputFieldByTypeProps) {
    const { attribute, kcClsx, dispatchFormAction, valueOrValues, i18n, displayableErrors } = props;
    const { advancedMsg, msgStr } = i18n;
    const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer((revealed: boolean) => !revealed, false);

    assert(typeof valueOrValues === "string");
    const hasError = displayableErrors.find(error => error.fieldIndex === undefined) !== undefined;

    return (
        <div className="p-inputgroup w-full">
            <FloatLabel className="w-full">
                <InputText
                    type={isPasswordRevealed ? "text" : "password"}
                    id={attribute.name}
                    name={attribute.name}
                    value={valueOrValues}
                    className="w-full text-base text-gray-100"
                    invalid={hasError}
                    disabled={attribute.readOnly}
                    autoComplete={attribute.autocomplete ?? "new-password"}
                    onChange={event =>
                        dispatchFormAction({
                            action: "update",
                            name: attribute.name,
                            valueOrValues: event.target.value
                        })
                    }
                    onBlur={() =>
                        dispatchFormAction({
                            action: "focus lost",
                            name: attribute.name,
                            fieldIndex: undefined
                        })
                    }
                />
                <label htmlFor={attribute.name}>
                    {advancedMsg(attribute.displayName ?? "")}
                    {attribute.required ? " *" : ""}
                </label>
            </FloatLabel>
            <Button
                type="button"
                icon={"pi " + (isPasswordRevealed ? "pi-eye-slash" : "pi-eye")}
                severity="secondary"
                className={kcClsx("kcFormPasswordVisibilityButtonClass")}
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={attribute.name}
                aria-pressed={isPasswordRevealed}
                onClick={toggleIsPasswordRevealed}
            />
        </div>
    );
}

function InputTag(props: InputFieldByTypeProps & { fieldIndex: number | undefined }) {
    const { attribute, fieldIndex, kcClsx, dispatchFormAction, valueOrValues, i18n, displayableErrors, useFloatingLabel } = props;
    const { advancedMsg, advancedMsgStr } = i18n;

    const resolvedType = (() => {
        const { inputType } = attribute.annotations;
        if (inputType?.startsWith("html5-")) {
            return inputType.slice(6);
        }
        if (attribute.name === "email") {
            return "email";
        }
        return inputType ?? "text";
    })();

    const isIdentifier = attribute.name === "username" || attribute.name === "email" || resolvedType === "email";
    const hasError = displayableErrors.find(error => error.fieldIndex === fieldIndex) !== undefined;

    const currentValue = (() => {
        if (fieldIndex !== undefined) {
            assert(valueOrValues instanceof Array);
            return valueOrValues[fieldIndex];
        }
        assert(typeof valueOrValues === "string");
        return valueOrValues;
    })();

    const inputElement = (
        <InputText
            type={resolvedType}
            id={attribute.name}
            name={attribute.name}
            value={currentValue}
            className="w-full text-base text-gray-100"
            invalid={hasError}
            disabled={attribute.readOnly}
            autoComplete={attribute.autocomplete}
            autoCorrect={isIdentifier ? "off" : undefined}
            autoCapitalize={isIdentifier ? "off" : undefined}
            spellCheck={isIdentifier ? false : undefined}
            placeholder={
                useFloatingLabel || attribute.annotations.inputTypePlaceholder === undefined
                    ? undefined
                    : advancedMsgStr(attribute.annotations.inputTypePlaceholder)
            }
            pattern={attribute.annotations.inputTypePattern}
            size={attribute.annotations.inputTypeSize === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeSize}`)}
            maxLength={attribute.annotations.inputTypeMaxlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMaxlength}`)}
            minLength={attribute.annotations.inputTypeMinlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMinlength}`)}
            max={attribute.annotations.inputTypeMax}
            min={attribute.annotations.inputTypeMin}
            step={attribute.annotations.inputTypeStep}
            {...Object.fromEntries(Object.entries(attribute.html5DataAnnotations ?? {}).map(([key, value]) => [`data-${key}`, value]))}
            onChange={event =>
                dispatchFormAction({
                    action: "update",
                    name: attribute.name,
                    valueOrValues: (() => {
                        if (fieldIndex !== undefined) {
                            assert(valueOrValues instanceof Array);
                            return valueOrValues.map((value, i) => {
                                if (i === fieldIndex) {
                                    return event.target.value;
                                }
                                return value;
                            });
                        }

                        return event.target.value;
                    })()
                })
            }
            onBlur={() =>
                dispatchFormAction({
                    action: "focus lost",
                    name: attribute.name,
                    fieldIndex: fieldIndex
                })
            }
        />
    );

    return (
        <>
            {useFloatingLabel ? (
                <FloatLabel>
                    {inputElement}
                    <label htmlFor={attribute.name}>
                        {advancedMsg(attribute.displayName ?? "")}
                        {attribute.required ? " *" : ""}
                    </label>
                </FloatLabel>
            ) : (
                inputElement
            )}
            {(() => {
                if (fieldIndex === undefined) {
                    return null;
                }

                assert(valueOrValues instanceof Array);
                const values = valueOrValues;

                return (
                    <>
                        <FieldErrors attribute={attribute} kcClsx={kcClsx} displayableErrors={displayableErrors} fieldIndex={fieldIndex} />
                        <AddRemoveButtonsMultiValuedAttribute
                            attribute={attribute}
                            values={values}
                            fieldIndex={fieldIndex}
                            dispatchFormAction={dispatchFormAction}
                            i18n={i18n}
                        />
                    </>
                );
            })()}
        </>
    );
}

function AddRemoveButtonsMultiValuedAttribute(props: {
    attribute: Attribute;
    values: string[];
    fieldIndex: number;
    dispatchFormAction: React.Dispatch<FormAction>;
    i18n: I18n;
}) {
    const { attribute, values, fieldIndex, dispatchFormAction, i18n } = props;
    const { msg } = i18n;
    const { hasAdd, hasRemove } = getButtonToDisplayForMultivaluedAttributeField({ attribute, values, fieldIndex });
    const idPostfix = `-${attribute.name}-${fieldIndex + 1}`;

    return (
        <div className="mt-1.5 flex items-center gap-2 text-xs font-semibold text-[#172b4d]">
            {hasRemove && (
                <>
                    <button
                        id={`kc-remove${idPostfix}`}
                        type="button"
                        className="underline hover:text-[#111827] bg-transparent border-0 cursor-pointer p-0"
                        onClick={() =>
                            dispatchFormAction({
                                action: "update",
                                name: attribute.name,
                                valueOrValues: values.filter((_, i) => i !== fieldIndex)
                            })
                        }
                    >
                        {msg("remove")}
                    </button>
                    {hasAdd ? <span>|</span> : null}
                </>
            )}
            {hasAdd && (
                <button
                    id={`kc-add${idPostfix}`}
                    type="button"
                    className="underline hover:text-[#111827] bg-transparent border-0 cursor-pointer p-0"
                    onClick={() =>
                        dispatchFormAction({
                            action: "update",
                            name: attribute.name,
                            valueOrValues: [...values, ""]
                        })
                    }
                >
                    {msg("addValue")}
                </button>
            )}
        </div>
    );
}

function InputTagSelects(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, i18n, valueOrValues } = props;

    const { inputType } = (() => {
        const { inputType } = attribute.annotations;
        assert(inputType === "select-radiobuttons" || inputType === "multiselect-checkboxes");
        return {
            inputType: inputType === "select-radiobuttons" ? "radio" : "checkbox"
        };
    })();

    const options = (() => {
        walk: {
            const { inputOptionsFromValidation } = attribute.annotations;
            if (inputOptionsFromValidation === undefined) {
                break walk;
            }
            const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];
            if (validator === undefined || validator.options === undefined) {
                break walk;
            }
            return validator.options;
        }
        return attribute.validators.options?.options ?? [];
    })();

    return (
        <div className="flex flex-col gap-2">
            {options.map(option => (
                <div key={option} className="flex items-center gap-2">
                    <input
                        type={inputType}
                        id={`${attribute.name}-${option}`}
                        name={attribute.name}
                        value={option}
                        className="accent-[#172b4d] h-4 w-4"
                        aria-invalid={props.displayableErrors.length !== 0}
                        disabled={attribute.readOnly}
                        checked={valueOrValues instanceof Array ? valueOrValues.includes(option) : valueOrValues === option}
                        onChange={event =>
                            dispatchFormAction({
                                action: "update",
                                name: attribute.name,
                                valueOrValues: (() => {
                                    const isChecked = event.target.checked;
                                    if (valueOrValues instanceof Array) {
                                        const newValues = [...valueOrValues];
                                        if (isChecked) {
                                            newValues.push(option);
                                        } else {
                                            newValues.splice(newValues.indexOf(option), 1);
                                        }
                                        return newValues;
                                    }
                                    return event.target.checked ? option : "";
                                })()
                            })
                        }
                        onBlur={() =>
                            dispatchFormAction({
                                action: "focus lost",
                                name: attribute.name,
                                fieldIndex: undefined
                            })
                        }
                    />
                    <label htmlFor={`${attribute.name}-${option}`} className="text-sm font-medium text-[#172b4d] cursor-pointer">
                        {inputLabel(i18n, attribute, option)}
                    </label>
                </div>
            ))}
        </div>
    );
}

function TextareaTag(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, displayableErrors, valueOrValues } = props;
    assert(typeof valueOrValues === "string");

    return (
        <textarea
            id={attribute.name}
            name={attribute.name}
            className="p-inputtext p-component w-full text-base text-gray-100 rounded-md p-3"
            aria-invalid={displayableErrors.length !== 0}
            disabled={attribute.readOnly}
            cols={attribute.annotations.inputTypeCols === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeCols}`)}
            rows={attribute.annotations.inputTypeRows === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeRows}`)}
            maxLength={attribute.annotations.inputTypeMaxlength === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeMaxlength}`)}
            value={valueOrValues}
            onChange={event =>
                dispatchFormAction({
                    action: "update",
                    name: attribute.name,
                    valueOrValues: event.target.value
                })
            }
            onBlur={() =>
                dispatchFormAction({
                    action: "focus lost",
                    name: attribute.name,
                    fieldIndex: undefined
                })
            }
        />
    );
}

function SelectTag(props: InputFieldByTypeProps) {
    const { attribute, dispatchFormAction, displayableErrors, i18n, valueOrValues } = props;
    const isMultiple = attribute.annotations.inputType === "multiselect";

    return (
        <select
            id={attribute.name}
            name={attribute.name}
            className="p-inputtext p-component w-full text-base text-gray-100 rounded-md p-3"
            aria-invalid={displayableErrors.length !== 0}
            disabled={attribute.readOnly}
            multiple={isMultiple}
            size={attribute.annotations.inputTypeSize === undefined ? undefined : parseInt(`${attribute.annotations.inputTypeSize}`)}
            value={valueOrValues}
            onChange={event =>
                dispatchFormAction({
                    action: "update",
                    name: attribute.name,
                    valueOrValues: (() => {
                        if (isMultiple) {
                            return Array.from(event.target.selectedOptions).map(option => option.value);
                        }
                        return event.target.value;
                    })()
                })
            }
            onBlur={() =>
                dispatchFormAction({
                    action: "focus lost",
                    name: attribute.name,
                    fieldIndex: undefined
                })
            }
        >
            {!isMultiple && <option value=""></option>}
            {(() => {
                const options = (() => {
                    walk: {
                        const { inputOptionsFromValidation } = attribute.annotations;
                        if (inputOptionsFromValidation === undefined) {
                            break walk;
                        }
                        assert(typeof inputOptionsFromValidation === "string");
                        const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];
                        if (validator === undefined || validator.options === undefined) {
                            break walk;
                        }
                        return validator.options;
                    }
                    return attribute.validators.options?.options ?? [];
                })();

                return options.map(option => (
                    <option key={option} value={option}>
                        {inputLabel(i18n, attribute, option)}
                    </option>
                ));
            })()}
        </select>
    );
}

function inputLabel(i18n: I18n, attribute: Attribute, option: string) {
    const { advancedMsg } = i18n;
    if (attribute.annotations.inputOptionLabels !== undefined) {
        const { inputOptionLabels } = attribute.annotations;
        return advancedMsg(inputOptionLabels[option] ?? option);
    }
    if (attribute.annotations.inputOptionLabelsI18nPrefix !== undefined) {
        return advancedMsg(`${attribute.annotations.inputOptionLabelsI18nPrefix}.${option}`);
    }
    return option;
}
