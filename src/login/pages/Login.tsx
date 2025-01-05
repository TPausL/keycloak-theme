import { useState, useEffect, useReducer } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";

import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";

import { FloatLabel } from "primereact/floatlabel";
import "primereact/resources/primereact.css"; //core css
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer((isPasswordRevealed: boolean) => !isPasswordRevealed, false);

    useEffect(() => {
        const passwordInputElement = document.getElementById("password") as HTMLInputElement;
        if (passwordInputElement) {
            passwordInputElement.type = isPasswordRevealed ? "text" : "password";
        }
    }, [isPasswordRevealed]);

    const [rememberMeChecked, setRememberMeChecked] = useState(!!login.rememberMe);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div id="kc-registration-container">
                    <div id="kc-registration">
                        <span>
                            {msg("noAccount")}{" "}
                            <a tabIndex={8} href={url.registrationUrl}>
                                {msg("doRegister")}
                            </a>
                        </span>
                    </div>
                </div>
            }
            socialProvidersNode={
                <>
                    {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                        <div id="kc-social-providers">
                            <hr />
                            <h2 className="text-sm font-light text-center">{msg("identity-provider-login-label")}</h2>
                            <div className="flex w-full flex-wrap gap-3">
                                {social.providers.map((...[p, , _providers]) => {
                                    console.log(p);
                                    return (
                                        <Button
                                            icon={p.iconClasses}
                                            severity="danger"
                                            type="button"
                                            onClick={() => (window.location.href = p.loginUrl)}
                                            key={p.alias}
                                            id={`social-${p.alias}`}
                                            className="basis-2/5 shrink-0 grow text-[rgb(100,116,139)] justify-center"
                                            label={kcSanitize(p.displayName)}
                                            text
                                            raised
                                            iconPos="left"
                                            pt={{ label: { className: "grow-0" } }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            }
        >
            <div id="kc-form" className="pt-0.5">
                <div id="kc-form-wrapper">
                    {realm.password && (
                        <form
                            id="kc-form-login"
                            onSubmit={() => {
                                setIsLoginButtonDisabled(true);
                                return true;
                            }}
                            action={url.loginAction}
                            method="post"
                        >
                            {!usernameHidden && (
                                <FloatLabel>
                                    <label htmlFor="username" className="translate-y-px">
                                        {!realm.loginWithEmailAllowed
                                            ? msg("username")
                                            : !realm.registrationEmailAsUsername
                                              ? msg("usernameOrEmail")
                                              : msg("email")}
                                    </label>
                                    <InputText
                                        tabIndex={2}
                                        id="username"
                                        name="username"
                                        className="w-full p-inputtext-lg"
                                        defaultValue={login.username ?? ""}
                                        type="text"
                                        autoFocus
                                        autoComplete="username"
                                        invalid={messagesPerField.existsError("username", "password")}
                                        aria-describedby="input-error-username"
                                    />
                                    {messagesPerField.existsError("username", "password") && (
                                        <small
                                            className="text-red-600"
                                            id="input-error-username"
                                            aria-live="polite"
                                            dangerouslySetInnerHTML={{
                                                __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                            }}
                                        />
                                    )}
                                </FloatLabel>
                            )}

                            <FloatLabel className="mt-8">
                                <label htmlFor="password" className="translate-y-px">
                                    {msg("password")}
                                </label>
                                <div className="p-inputgroup flex-1">
                                    <InputText
                                        className="p-inputtext-lg"
                                        tabIndex={3}
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        invalid={messagesPerField.existsError("username", "password")}
                                        aria-describedby="input-error-password"
                                    />
                                    <Button
                                        // className="p-inputgroup-addon"
                                        icon={"pi " + (isPasswordRevealed ? "pi-eye-slash" : "pi-eye")}
                                        onClick={toggleIsPasswordRevealed}
                                        type="button"
                                    />
                                </div>
                                {usernameHidden && messagesPerField.existsError("username", "password") && (
                                    <small
                                        id="input-error-password"
                                        className={kcClsx("kcInputErrorMessageClass")}
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                        }}
                                    />
                                )}
                            </FloatLabel>

                            <div className={kcClsx("kcFormGroupClass", "kcFormSettingClass") + " mt-4"}>
                                <div id="kc-form-options">
                                    {realm.rememberMe && !usernameHidden && (
                                        <div className="ml-1 flex justify-center items-center">
                                            <Checkbox
                                                tabIndex={5}
                                                id="rememberMe"
                                                name="rememberMe"
                                                checked={rememberMeChecked}
                                                onChange={e => setRememberMeChecked(e.checked ?? false)}
                                                //checked={!!login.rememberMe}
                                                //defaultChecked={!!login.rememberMe}
                                            />
                                            <label htmlFor="rememberMe" className="ml-2 mb-0">
                                                {" "}
                                                {msg("rememberMe")}
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <div className={kcClsx("kcFormOptionsWrapperClass")}>
                                    {realm.resetPasswordAllowed && (
                                        <span>
                                            <a tabIndex={6} href={url.loginResetCredentialsUrl}>
                                                {msg("doForgotPassword")}
                                            </a>
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                                <Button
                                    tabIndex={7}
                                    label={msgStr("doLogIn")}
                                    name="login"
                                    id="kc-login"
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoginButtonDisabled}
                                    raised
                                    size="large"
                                />
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Template>
    );
}
