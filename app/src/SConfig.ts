import { SThemeThemes } from 'servisofts-component'
const SThemeProps: SThemeThemes = {
    default: {
        barStyle: "light-content",
        barColor: "#222222",
        text:"#000000",
        primary: "#000000",
        secondary: "#ffffff",
        info: "#DE5738",
        background: "#ffffff",
        card: "#dddddd66",
        
    },
    dark: {
        barStyle: "light-content",
        barColor: "#000000",
        text:"#ffffff",
        primary: "#2A333F",
        secondary: "#ffffff",
        info: "#DE5738",
        background: "#000000",
        card: "#2A333F66",
    }
}

const SocketProps = {
    name: 'sland',

    host: '192.168.0.199',
    ssl: false,

    port: {
        native: 10030,
        web: 20030,
        http: 30030,
    },

    cert: "MIID1DCCArygAwIBAgIEYZwc5jANBgkqhkiG9w0BAQsFADCBqzELMAkGA1UEBhMCQk8xEjAQBgNVBAgMCUF2IEJhbnplcjETMBEGA1UEBwwKU2FudGEgQ3J1ejEXMBUGA1UECgwOU2Vydmlzb2Z0cyBTUkwxEDAOBgNVBAsMB2tvbHBpbmcxHzAdBgNVBAMMFmtvbHBpbmcuc2Vydmlzb2Z0cy5jb20xJzAlBgkqhkiG9w0BCQEWGHJpY2t5LnBhei5kLjk3QGdtYWlsLmNvbTAeFw0yMTExMjIyMjQyNDZaFw0yMTExMjMyMjQyNDZaMIGrMQswCQYDVQQGEwJCTzESMBAGA1UECAwJQXYgQmFuemVyMRMwEQYDVQQHDApTYW50YSBDcnV6MRcwFQYDVQQKDA5TZXJ2aXNvZnRzIFNSTDEQMA4GA1UECwwHa29scGluZzEfMB0GA1UEAwwWa29scGluZy5zZXJ2aXNvZnRzLmNvbTEnMCUGCSqGSIb3DQEJARYYcmlja3kucGF6LmQuOTdAZ21haWwuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvZU+uunfcY4kN7MRx3j2DHOzFlS0cmFyneSNtsbmuyRAijLbn/x2r8KnIsQ0mMzYggDHaWoGKFGh4Hzl3/XNv4zdaKtSqijiazQY0JHxWFdHLiUCrwlCnkWAc0sjbHJV6yXong0DZIhK1pWZ08boGyk4zLWn27mQBS/e3prrKScMKmV2UZ9ajepJnqRMK7Z+BeUYN3w8IWEOl4Q59/V0GEymfUSUrME+0kZNSEtykCFiw2im3zEwOht2BXHTZlz3dY1MJ5U8A1EOZu/nr3AL925ecL1mvNR9H3u2lgKa4oq4GIZH1qGqjvci3gp8N1oJIR1JB9TZdvJZcMFPG9ZGTwIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQBY7rHFwSxbQHDaltn+VuS/wIJWAjFzEqwMP9j0Mf54Gk7jGZp1U6jdBUaD6eyIF8+qSxtRg2CpOzTwZUDtO/TyuKkHDrr0TWKPK1U8UXINQcl0DCDG/xL7ajwvOMSG7uSV+uRhQ7xlxeU1BsSSV95OqhPQtc1xIVjyOTXSQxqVXiaGcnlMiIB9nh7z3PgXCTDzI34EDdwbEdwVuDdD82Bnyr9M3PmZt4kAvec/Liw0boBd96uGDnKaUrKSMID7fTW3KINN6KOGkTA2cvhZ1MnC48bMDPsrCiq6NmXtWiqQTZxZNj4rxUnW6Eeq9S4Q5f9p4tk8ZsH/o9NebmnufPWu",
    apis: {
        // servicio:"https://servicio.ss.lo/http/",
        roles_permisos: "https://rolespermisos.servisofts.com/http/"
        // rp: "http://192.168.0.21:30016/"
    }
}
export default {
    SocketProps,
    SThemeProps
}