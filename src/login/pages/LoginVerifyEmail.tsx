import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginVerifyEmail(props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { msg } = i18n;
    const { url, user } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo={true}
            headerNode={msg("emailVerifyTitle")}
            infoNode={
                <p className="text-xs text-[#172b4d]/90 font-medium leading-relaxed m-0">
                    {msg("emailVerifyInstruction2")}
                    <br />
                    <a
                        href={url.loginAction}
                        className="font-bold text-[#172b4d] underline underline-offset-4 hover:text-[#111827] transition-colors"
                    >
                        {msg("doClickHere")}
                    </a>
                    &nbsp;
                    {msg("emailVerifyInstruction3")}
                </p>
            }
        >
            <div className="rounded-lg bg-[#243b67] border border-[#172b4d] p-4 text-sm text-gray-100 leading-relaxed flex items-start gap-3">
                <i className="pi pi-envelope text-[#fbb140] text-lg shrink-0 mt-0.5" aria-hidden="true" />
                <p className="m-0">{msg("emailVerifyInstruction1", user?.email ?? "")}</p>
            </div>
        </Template>
    );
}
