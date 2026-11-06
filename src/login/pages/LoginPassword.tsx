import { useState, useReducer } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";

export default function LoginPassword(props: PageProps<Extract<KcContext, { pageId: "login-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { realm, url, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    const [password, setPassword] = useState("");
    const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer((revealed: boolean) => !revealed, false);

    const hasPasswordError = messagesPerField.existsError("password");

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("doLogIn")}
            displayMessage={!hasPasswordError}
        >
            <div id="kc-form" className="pt-4">
                <div id="kc-form-wrapper">
                    <form
                        id="kc-form-login"
                        onSubmit={() => {
                            setIsLoginButtonDisabled(true);
                            return true;
                        }}
                        action={url.loginAction}
                        method="post"
                    >
                        <div className="mb-4">
                            <div className="p-inputgroup w-full">
                                <FloatLabel className="w-full">
                                    <InputText
                                        className="w-full text-base text-gray-100"
                                        tabIndex={2}
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        type={isPasswordRevealed ? "text" : "password"}
                                        autoFocus
                                        autoComplete="current-password"
                                        enterKeyHint="done"
                                        invalid={hasPasswordError}
                                        aria-describedby={hasPasswordError ? "input-error-password" : undefined}
                                    />
                                    <label htmlFor="password">{msg("password")}</label>
                                </FloatLabel>
                                <Button
                                    icon={"pi " + (isPasswordRevealed ? "pi-eye-slash" : "pi-eye")}
                                    onClick={toggleIsPasswordRevealed}
                                    type="button"
                                    className="text-gray-200"
                                    severity="secondary"
                                    aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                                    aria-controls="password"
                                    aria-pressed={isPasswordRevealed}
                                />
                            </div>

                            {hasPasswordError && (
                                <div
                                    id="input-error-password"
                                    className="mt-2.5 flex items-center gap-2 rounded-md bg-[#1e355e]/95 px-3 py-2 text-xs font-medium text-red-100 border border-red-300/60 shadow-sm"
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

                        {realm.resetPasswordAllowed && (
                            <div className="flex justify-end my-4 text-sm">
                                <a
                                    tabIndex={5}
                                    href={url.loginResetCredentialsUrl}
                                    className="font-semibold text-[#172b4d] underline-offset-4 hover:underline hover:text-[#111827] transition-colors"
                                >
                                    {msg("doForgotPassword")}
                                </a>
                            </div>
                        )}

                        <div id="kc-form-buttons" className={clsx(kcClsx("kcFormGroupClass"), "mt-4")}>
                            <Button
                                tabIndex={4}
                                label={msgStr("doLogIn")}
                                name="login"
                                id="kc-login"
                                type="submit"
                                className="w-full text-gray-100 font-semibold"
                                disabled={isLoginButtonDisabled}
                                raised
                                severity="secondary"
                                size="large"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </Template>
    );
}
