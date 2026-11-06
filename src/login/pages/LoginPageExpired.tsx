import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginPageExpired(props: PageProps<Extract<KcContext, { pageId: "login-page-expired.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url } = kcContext;
    const { msg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("pageExpiredTitle")}>
            <div className="flex flex-col gap-3 pt-2">
                <a
                    id="loginRestartLink"
                    href={url.loginRestartFlowUrl}
                    className="group flex items-center gap-3.5 rounded-lg bg-[#243b67] hover:bg-[#172b4d] border border-[#172b4d] p-4 text-gray-100 no-underline shadow-sm transition-all"
                >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#172b4d] text-[#fbb140] group-hover:bg-[#fb6340] group-hover:text-[#172b4d] transition-colors">
                        <i className="pi pi-refresh" aria-hidden="true" />
                    </div>
                    <div className="flex-1 text-sm">
                        <div className="text-gray-200">{msg("pageExpiredMsg1")}</div>
                        <div className="font-semibold text-[#fbb140] group-hover:underline mt-0.5">{msg("doClickHere")}</div>
                    </div>
                </a>

                <a
                    id="loginContinueLink"
                    href={url.loginAction}
                    className="group flex items-center gap-3.5 rounded-lg bg-[#243b67] hover:bg-[#172b4d] border border-[#172b4d] p-4 text-gray-100 no-underline shadow-sm transition-all"
                >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#172b4d] text-[#fbb140] group-hover:bg-[#fb6340] group-hover:text-[#172b4d] transition-colors">
                        <i className="pi pi-arrow-right" aria-hidden="true" />
                    </div>
                    <div className="flex-1 text-sm">
                        <div className="text-gray-200">{msg("pageExpiredMsg2")}</div>
                        <div className="font-semibold text-[#fbb140] group-hover:underline mt-0.5">{msg("doClickHere")}</div>
                    </div>
                </a>
            </div>
        </Template>
    );
}
