import { useState, useReducer } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { FloatLabel } from "primereact/floatlabel";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    const [username, setUsername] = useState(login.username ?? "");
    const [password, setPassword] = useState("");
    const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer((revealed: boolean) => !revealed, false);
    const [rememberMeChecked, setRememberMeChecked] = useState(!!login.rememberMe);

    const hasCredentialError = messagesPerField.existsError("username", "password");
    const isEmailAsUsername = realm.loginWithEmailAllowed && realm.registrationEmailAsUsername;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!hasCredentialError}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div id="kc-registration-container">
                    <div id="kc-registration" className="text-sm">
                        <span className="text-[#172b4d]/90 font-medium">
                            {msg("noAccount")}{" "}
                            <a
                                tabIndex={8}
                                href={url.registrationUrl}
                                className="font-bold text-[#172b4d] underline underline-offset-4 hover:text-[#111827] transition-colors"
                            >
                                {msg("doRegister")}
                            </a>
                        </span>
                    </div>
                </div>
            }
            socialProvidersNode={
                <>
                    {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                        <div id="kc-social-providers" className="mt-6">
                            <div className="relative flex items-center py-2 mb-3">
                                <div className="flex-grow border-t border-[#172b4d]/25"></div>
                                <h2 className="flex-shrink mx-3 text-xs font-semibold uppercase tracking-wider text-[#172b4d] m-0">
                                    {msg("identity-provider-login-label")}
                                </h2>
                                <div className="flex-grow border-t border-[#172b4d]/25"></div>
                            </div>
                            <div className={clsx("grid gap-2.5", social.providers.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1")}>
                                {social.providers.map(p => (
                                    <Button
                                        icon={p.iconClasses}
                                        severity="secondary"
                                        type="button"
                                        onClick={() => {
                                            window.location.href = p.loginUrl;
                                        }}
                                        key={p.alias}
                                        id={`social-${p.alias}`}
                                        className="w-full text-gray-100 justify-center text-sm py-2.5"
                                        label={kcSanitize(p.displayName)}
                                        raised
                                        iconPos="left"
                                        pt={{ label: { className: "grow-0 truncate" } }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            }
        >
            <div id="kc-form" className="pt-4">
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
                                <div className="mb-8">
                                    <FloatLabel>
                                        <InputText
                                            tabIndex={2}
                                            id="username"
                                            name="username"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            className="w-full text-base text-gray-100"
                                            type={isEmailAsUsername ? "email" : "text"}
                                            autoFocus
                                            autoComplete="username"
                                            autoCorrect="off"
                                            autoCapitalize="off"
                                            spellCheck={false}
                                            enterKeyHint="next"
                                            invalid={hasCredentialError}
                                            aria-describedby={hasCredentialError ? "input-error-credentials" : undefined}
                                        />
                                        <label htmlFor="username">
                                            {!realm.loginWithEmailAllowed
                                                ? msg("username")
                                                : !realm.registrationEmailAsUsername
                                                  ? msg("usernameOrEmail")
                                                  : msg("email")}
                                        </label>
                                    </FloatLabel>
                                </div>
                            )}

                            <div className="mb-4">
                                <div className="p-inputgroup w-full">
                                    <FloatLabel className="w-full">
                                        <InputText
                                            className="w-full text-base text-gray-100"
                                            tabIndex={3}
                                            id="password"
                                            name="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            type={isPasswordRevealed ? "text" : "password"}
                                            autoComplete="current-password"
                                            enterKeyHint="done"
                                            invalid={hasCredentialError}
                                            aria-describedby={hasCredentialError ? "input-error-credentials" : undefined}
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

                                {hasCredentialError && (
                                    <div
                                        id="input-error-credentials"
                                        className="mt-2.5 flex items-center gap-2 rounded-md bg-[#1e355e]/95 px-3 py-2 text-xs font-medium text-red-100 border border-red-300/60 shadow-sm"
                                        aria-live="polite"
                                    >
                                        <i className="pi pi-exclamation-circle text-red-300 shrink-0" aria-hidden="true" />
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 my-5 text-sm">
                                <div id="kc-form-options">
                                    {realm.rememberMe && !usernameHidden && (
                                        <div className="flex items-center">
                                            <Checkbox
                                                tabIndex={5}
                                                inputId="rememberMe"
                                                name="rememberMe"
                                                checked={rememberMeChecked}
                                                onChange={e => setRememberMeChecked(e.checked ?? false)}
                                            />
                                            <label htmlFor="rememberMe" className="ml-2 mb-0 font-medium text-[#172b4d] cursor-pointer select-none">
                                                {msg("rememberMe")}
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <div className={kcClsx("kcFormOptionsWrapperClass")}>
                                    {realm.resetPasswordAllowed && (
                                        <a
                                            tabIndex={6}
                                            href={url.loginResetCredentialsUrl}
                                            className="font-semibold text-[#172b4d] underline-offset-4 hover:underline hover:text-[#111827] transition-colors"
                                        >
                                            {msg("doForgotPassword")}
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div id="kc-form-buttons" className={clsx(kcClsx("kcFormGroupClass"), "mt-2")}>
                                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                                <Button
                                    tabIndex={7}
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
                    )}
                </div>
            </div>
        </Template>
    );
}
