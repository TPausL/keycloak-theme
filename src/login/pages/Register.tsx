import { useState, useLayoutEffect } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import { clsx } from "keycloakify/tools/clsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

export default function Register(props: RegisterProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { messageHeader, url, messagesPerField, recaptchaRequired, recaptchaVisible, recaptchaSiteKey, recaptchaAction, termsAcceptanceRequired } =
        kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    const [isFormSubmittable, setIsFormSubmittable] = useState(false);
    const [areTermsAccepted, setAreTermsAccepted] = useState(false);

    useLayoutEffect(() => {
        (window as unknown as Record<string, () => void>)["onSubmitRecaptcha"] = () => {
            (document.getElementById("kc-register-form") as HTMLFormElement | null)?.requestSubmit();
        };

        return () => {
            delete (window as unknown as Record<string, () => void>)["onSubmitRecaptcha"];
        };
    }, []);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={messageHeader !== undefined ? advancedMsg(messageHeader) : msg("registerTitle")}
            displayMessage={messagesPerField.exists("global")}
            displayRequiredFields={true}
        >
            <form id="kc-register-form" className="pt-4" action={url.registrationAction} method="post">
                <UserProfileFormFields
                    kcContext={kcContext}
                    i18n={i18n}
                    kcClsx={kcClsx}
                    onIsFormSubmittableValueChange={setIsFormSubmittable}
                    doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                />
                {termsAcceptanceRequired && (
                    <TermsAcceptance
                        i18n={i18n}
                        kcClsx={kcClsx}
                        messagesPerField={messagesPerField}
                        areTermsAccepted={areTermsAccepted}
                        onAreTermsAcceptedValueChange={setAreTermsAccepted}
                    />
                )}
                {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
                    <div className="my-4">
                        <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} data-action={recaptchaAction} />
                    </div>
                )}
                <div className="mt-6">
                    {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined ? (
                        <div id="kc-form-buttons">
                            <Button
                                className={clsx("w-full text-gray-100 font-semibold g-recaptcha")}
                                data-sitekey={recaptchaSiteKey}
                                data-callback="onSubmitRecaptcha"
                                data-action={recaptchaAction}
                                type="submit"
                                label={msgStr("doRegister")}
                                severity="secondary"
                                size="large"
                                raised
                            />
                        </div>
                    ) : (
                        <div id="kc-form-buttons">
                            <Button
                                disabled={!isFormSubmittable || (termsAcceptanceRequired && !areTermsAccepted)}
                                className="w-full text-gray-100 font-semibold"
                                type="submit"
                                label={msgStr("doRegister")}
                                severity="secondary"
                                size="large"
                                raised
                            />
                        </div>
                    )}

                    <div id="kc-form-options" className="mt-4 text-center">
                        <a
                            href={url.loginUrl}
                            className="text-sm font-semibold text-[#172b4d] underline underline-offset-4 hover:text-[#111827] transition-colors"
                        >
                            {msg("backToLogin")}
                        </a>
                    </div>
                </div>
            </form>
        </Template>
    );
}

function TermsAcceptance(props: {
    i18n: I18n;
    kcClsx: KcClsx;
    messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
    areTermsAccepted: boolean;
    onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
}) {
    const { i18n, messagesPerField, areTermsAccepted, onAreTermsAcceptedValueChange } = props;
    const { msg } = i18n;

    return (
        <div className="my-5">
            <div className="rounded-lg bg-[#243b67] border border-[#172b4d] p-3 text-gray-100 text-xs mb-3">
                <div className="font-semibold mb-1 text-sm">{msg("termsTitle")}</div>
                <div id="kc-registration-terms-text" className="max-h-28 overflow-y-auto text-gray-200 leading-relaxed m-0">
                    {msg("termsText")}
                </div>
            </div>
            <div className="flex items-center">
                <Checkbox
                    inputId="termsAccepted"
                    name="termsAccepted"
                    checked={areTermsAccepted}
                    onChange={e => onAreTermsAcceptedValueChange(e.checked ?? false)}
                    invalid={messagesPerField.existsError("termsAccepted")}
                />
                <label htmlFor="termsAccepted" className="ml-2 mb-0 text-sm font-medium text-[#172b4d] cursor-pointer select-none">
                    {msg("acceptTerms")}
                </label>
            </div>
            {messagesPerField.existsError("termsAccepted") && (
                <div
                    id="input-error-terms-accepted"
                    className="mt-2 flex items-center gap-2 rounded-md bg-[#1e355e]/95 px-3 py-2 text-xs font-medium text-red-100 border border-red-300/60 shadow-sm"
                    aria-live="polite"
                >
                    <i className="pi pi-exclamation-circle text-red-300 shrink-0" aria-hidden="true" />
                    <span
                        dangerouslySetInnerHTML={{
                            __html: kcSanitize(messagesPerField.get("termsAccepted"))
                        }}
                    />
                </div>
            )}
        </div>
    );
}
