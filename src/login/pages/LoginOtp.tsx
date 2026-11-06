import { useState } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";

export default function LoginOtp(props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { otpLogin, url, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [otp, setOtp] = useState("");
    const [selectedCredentialId, setSelectedCredentialId] = useState(otpLogin.selectedCredentialId ?? otpLogin.userOtpCredentials[0]?.id ?? "");

    const hasTotpError = messagesPerField.existsError("totp");

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!hasTotpError}
            headerNode={msg("doLogIn")}
        >
            <form
                id="kc-otp-login-form"
                className={clsx(kcClsx("kcFormClass"), "pt-4")}
                action={url.loginAction}
                onSubmit={() => {
                    setIsSubmitting(true);
                    return true;
                }}
                method="post"
            >
                {otpLogin.userOtpCredentials.length > 1 && (
                    <fieldset className="mb-6 border-0 p-0 m-0">
                        <legend className="sr-only">{msg("loginChooseAuthenticator")}</legend>
                        <div className="grid grid-cols-1 gap-2.5">
                            {otpLogin.userOtpCredentials.map((otpCredential, index) => {
                                const isSelected = selectedCredentialId === otpCredential.id;
                                return (
                                    <label
                                        key={otpCredential.id}
                                        htmlFor={`kc-otp-credential-${index}`}
                                        className={clsx(
                                            "flex items-center gap-3 rounded-lg p-3 cursor-pointer border transition-all",
                                            isSelected
                                                ? "bg-[#172b4d] border-white text-white shadow-md"
                                                : "bg-[#243b67] border-white/20 text-gray-200 hover:bg-[#1e355e]"
                                        )}
                                    >
                                        <input
                                            id={`kc-otp-credential-${index}`}
                                            className="accent-[#fb6340] h-4 w-4"
                                            type="radio"
                                            name="selectedCredentialId"
                                            value={otpCredential.id}
                                            checked={isSelected}
                                            onChange={() => setSelectedCredentialId(otpCredential.id)}
                                        />
                                        <i className="pi pi-mobile text-[#fb6340]" aria-hidden="true" />
                                        <span className="text-sm font-medium">{otpCredential.userLabel}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </fieldset>
                )}

                <div className="mb-5">
                    <FloatLabel>
                        <InputText
                            id="otp"
                            name="otp"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}
                            enterKeyHint="done"
                            autoFocus
                            className="w-full text-lg tracking-widest font-mono text-gray-100"
                            invalid={hasTotpError}
                            aria-describedby={hasTotpError ? "input-error-otp-code" : undefined}
                        />
                        <label htmlFor="otp">{msg("loginOtpOneTime")}</label>
                    </FloatLabel>

                    {hasTotpError && (
                        <div
                            id="input-error-otp-code"
                            className="mt-2.5 flex items-center gap-2 rounded-md bg-[#1e355e]/95 px-3 py-2 text-xs font-medium text-red-100 border border-red-300/60 shadow-sm"
                            aria-live="polite"
                        >
                            <i className="pi pi-exclamation-circle text-red-300 shrink-0" aria-hidden="true" />
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(messagesPerField.get("totp"))
                                }}
                            />
                        </div>
                    )}
                </div>

                <div id="kc-form-buttons" className={clsx(kcClsx("kcFormGroupClass"), "mt-4")}>
                    <Button
                        label={msgStr("doLogIn")}
                        name="login"
                        id="kc-login"
                        type="submit"
                        className="w-full text-gray-100 font-semibold"
                        disabled={isSubmitting}
                        raised
                        severity="secondary"
                        size="large"
                    />
                </div>
            </form>
        </Template>
    );
}
