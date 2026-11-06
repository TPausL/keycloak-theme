import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "primereact/button";

export default function LogoutConfirm(props: PageProps<Extract<KcContext, { pageId: "logout-confirm.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url, client, logoutConfirm } = kcContext;
    const { msg, msgStr } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("logoutConfirmTitle")}>
            <div id="kc-logout-confirm" className="pt-2">
                <p className="text-sm font-medium text-[#172b4d] text-center mb-5">{msg("logoutConfirmHeader")}</p>
                <form className="form-actions" action={url.logoutConfirmAction} method="POST">
                    <input type="hidden" name="session_code" value={logoutConfirm.code} />
                    <div id="kc-form-buttons">
                        <Button
                            tabIndex={4}
                            className="w-full text-gray-100 font-semibold"
                            name="confirmLogout"
                            id="kc-logout"
                            type="submit"
                            label={msgStr("doLogout")}
                            severity="secondary"
                            size="large"
                            raised
                        />
                    </div>
                </form>
                <div id="kc-info-message">
                    {!logoutConfirm.skipLink && client.baseUrl && (
                        <div className="mt-4 text-center">
                            <a
                                href={client.baseUrl}
                                className="text-sm font-semibold text-[#172b4d] underline underline-offset-4 hover:text-[#111827] transition-colors"
                            >
                                {msg("backToApplication")}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </Template>
    );
}
