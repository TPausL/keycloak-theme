import { useState, useReducer } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { FloatLabel } from "primereact/floatlabel";

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { msg, msgStr } = i18n;
    const { url, messagesPerField, isAppInitiatedAction } = kcContext;

    const [passwordNew, setPasswordNew] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [isNewRevealed, toggleIsNewRevealed] = useReducer((v: boolean) => !v, false);
    const [isConfirmRevealed, toggleIsConfirmRevealed] = useReducer((v: boolean) => !v, false);
    const [logoutSessions, setLogoutSessions] = useState(true);

    const hasPasswordError = messagesPerField.existsError("password");
    const hasConfirmError = messagesPerField.existsError("password-confirm");
    const hasAnyError = messagesPerField.existsError("password", "password-confirm");

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!hasAnyError}
            headerNode={msg("updatePasswordTitle")}
        >
            <form id="kc-passwd-update-form" className={kcClsx("kcFormClass") + " pt-4"} action={url.loginAction} method="post">
                <div className="mb-7">
                    <div className="p-inputgroup w-full">
                        <FloatLabel className="w-full">
                            <InputText
                                type={isNewRevealed ? "text" : "password"}
                                id="password-new"
                                name="password-new"
                                value={passwordNew}
                                onChange={e => setPasswordNew(e.target.value)}
                                className="w-full text-base text-gray-100"
                                autoFocus
                                autoComplete="new-password"
                                enterKeyHint="next"
                                invalid={hasAnyError}
                                aria-describedby={hasPasswordError ? "input-error-password" : undefined}
                            />
                            <label htmlFor="password-new">{msg("passwordNew")}</label>
                        </FloatLabel>
                        <Button
                            type="button"
                            icon={"pi " + (isNewRevealed ? "pi-eye-slash" : "pi-eye")}
                            severity="secondary"
                            aria-label={msgStr(isNewRevealed ? "hidePassword" : "showPassword")}
                            aria-controls="password-new"
                            aria-pressed={isNewRevealed}
                            onClick={toggleIsNewRevealed}
                        />
                    </div>
                    {hasPasswordError && (
                        <div
                            id="input-error-password"
                            className="mt-2 flex items-center gap-2 rounded-md bg-[#1e355e]/95 px-3 py-2 text-xs font-medium text-red-100 border border-red-300/60 shadow-sm"
                            aria-live="polite"
                        >
                            <i className="pi pi-exclamation-circle text-red-300 shrink-0" aria-hidden="true" />
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(messagesPerField.get("password"))
                                }}
                            />
                        </div>
                    )}
                </div>

                <div className="mb-5">
                    <div className="p-inputgroup w-full">
                        <FloatLabel className="w-full">
                            <InputText
                                type={isConfirmRevealed ? "text" : "password"}
                                id="password-confirm"
                                name="password-confirm"
                                value={passwordConfirm}
                                onChange={e => setPasswordConfirm(e.target.value)}
                                className="w-full text-base text-gray-100"
                                autoComplete="new-password"
                                enterKeyHint="done"
                                invalid={hasAnyError}
                                aria-describedby={hasConfirmError ? "input-error-password-confirm" : undefined}
                            />
                            <label htmlFor="password-confirm">{msg("passwordConfirm")}</label>
                        </FloatLabel>
                        <Button
                            type="button"
                            icon={"pi " + (isConfirmRevealed ? "pi-eye-slash" : "pi-eye")}
                            severity="secondary"
                            aria-label={msgStr(isConfirmRevealed ? "hidePassword" : "showPassword")}
                            aria-controls="password-confirm"
                            aria-pressed={isConfirmRevealed}
                            onClick={toggleIsConfirmRevealed}
                        />
                    </div>
                    {hasConfirmError && (
                        <div
                            id="input-error-password-confirm"
                            className="mt-2 flex items-center gap-2 rounded-md bg-[#1e355e]/95 px-3 py-2 text-xs font-medium text-red-100 border border-red-300/60 shadow-sm"
                            aria-live="polite"
                        >
                            <i className="pi pi-exclamation-circle text-red-300 shrink-0" aria-hidden="true" />
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(messagesPerField.get("password-confirm"))
                                }}
                            />
                        </div>
                    )}
                </div>

                <div id="kc-form-options" className="my-5">
                    <div className="flex items-center">
                        <Checkbox
                            inputId="logout-sessions"
                            name="logout-sessions"
                            value="on"
                            checked={logoutSessions}
                            onChange={e => setLogoutSessions(e.checked ?? false)}
                        />
                        <label htmlFor="logout-sessions" className="ml-2 mb-0 text-sm font-medium text-[#172b4d] cursor-pointer select-none">
                            {msg("logoutOtherSessions")}
                        </label>
                    </div>
                </div>

                <div id="kc-form-buttons" className="flex flex-col gap-2.5 mt-4">
                    <Button
                        className="w-full text-gray-100 font-semibold"
                        type="submit"
                        label={msgStr("doSubmit")}
                        severity="secondary"
                        size="large"
                        raised
                    />
                    {isAppInitiatedAction && (
                        <Button
                            className="w-full text-gray-200"
                            type="submit"
                            name="cancel-aia"
                            value="true"
                            label={msgStr("doCancel")}
                            severity="secondary"
                            outlined
                        />
                    )}
                </div>
            </form>
        </Template>
    );
}
