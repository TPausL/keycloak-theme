import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, realm, auth, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [username, setUsername] = useState(auth?.attemptedUsername ?? "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const hasUsernameError = messagesPerField.existsError("username");
    const isEmailAsUsername = realm.loginWithEmailAllowed && realm.registrationEmailAsUsername;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo={true}
            displayMessage={!hasUsernameError}
            infoNode={
                <span className="text-xs text-[#172b4d]/90 font-medium leading-relaxed block">
                    {realm.duplicateEmailsAllowed ? msg("emailInstructionUsername") : msg("emailInstruction")}
                </span>
            }
            headerNode={msg("emailForgotTitle")}
        >
            <form
                id="kc-reset-password-form"
                className={kcClsx("kcFormClass") + " pt-4"}
                action={url.loginAction}
                method="post"
                onSubmit={() => {
                    setIsSubmitting(true);
                    return true;
                }}
            >
                <div className="mb-5">
                    <FloatLabel>
                        <InputText
                            type={isEmailAsUsername ? "email" : "text"}
                            id="username"
                            name="username"
                            className="w-full text-base text-gray-100"
                            autoFocus
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            autoComplete="username"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}
                            enterKeyHint="done"
                            invalid={hasUsernameError}
                            aria-describedby={hasUsernameError ? "input-error-username" : undefined}
                        />
                        <label htmlFor="username">
                            {!realm.loginWithEmailAllowed
                                ? msg("username")
                                : !realm.registrationEmailAsUsername
                                  ? msg("usernameOrEmail")
                                  : msg("email")}
                        </label>
                    </FloatLabel>

                    {hasUsernameError && (
                        <div
                            id="input-error-username"
                            className="mt-2.5 flex items-center gap-2 rounded-md bg-[#1e355e]/95 px-3 py-2 text-xs font-medium text-red-100 border border-red-300/60 shadow-sm"
                            aria-live="polite"
                        >
                            <i className="pi pi-exclamation-circle text-red-300 shrink-0" aria-hidden="true" />
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(messagesPerField.get("username"))
                                }}
                            />
                        </div>
                    )}
                </div>

                <div id="kc-form-buttons" className="mt-4">
                    <Button
                        className="w-full text-gray-100 font-semibold"
                        type="submit"
                        label={msgStr("doSubmit")}
                        disabled={isSubmitting}
                        severity="secondary"
                        size="large"
                        raised
                    />
                </div>

                <div id="kc-form-options" className="mt-4 text-center">
                    <a
                        href={url.loginUrl}
                        className="text-sm font-semibold text-[#172b4d] underline underline-offset-4 hover:text-[#111827] transition-colors"
                    >
                        {msg("backToLogin")}
                    </a>
                </div>
            </form>
        </Template>
    );
}
