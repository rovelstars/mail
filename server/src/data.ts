const data = {
  attachments: [],
  headers: Map(22) {
    "received": [ "from mail-ed1-x529.google.com (2a00:1450:4864:20::529) by cloudflare-email.net (cloudflare) id kBEBjlW273cp for <test@rovelstars.com>; Tue, 14 Oct 2025 15:45:25 +0000",
      "by mail-ed1-x529.google.com with SMTP id 4fb4d7f45d1cf-63bd822b007so1496766a12.2 for <test@rovelstars.com>; Tue, 14 Oct 2025 08:45:25 -0700 (PDT)"
    ],
    "arc-seal": "i=1; a=rsa-sha256; s=cf2024-1; d=cloudflare-email.net; cv=none; b=di+HnGkJh4GCiwLYA1BkbPc3fnbsDHGRH+twIIWoxXc+QungYWA3uW1A01+GNdsskqa8Ph99/ uO/GRUIPyfmhpUlCgvlxoaQfaWiNr0LNQpmUYwRSmL54H47Q4svh32yhuGkgdTfuzEV90A4YJA5 N5k+yLwa8jN1tuLFlhVBjHEDmciKup/FUhIG60StU376VK651znCGWMAgdLDSH+GfEVabKaT5MN O2QHcMfXXvI5TZyUWWAIFd/aVQ4vK6Fq3y47X0bWkc68WXKuz0HPrtDm0ZOnGAq62j8U4xLTI2J LVzfSY1b02CSHtL/m2sdTgZkVhk7+g/Eys5UxClsimMw==;",
    "arc-message-signature": "i=1; a=rsa-sha256; s=cf2024-1; d=cloudflare-email.net; c=relaxed/relaxed; h=To:Subject:Date:From:In-Reply-To:References:reply-to:cc:resent-date :resent-from:resent-to:resent-cc:list-id:list-help:list-unsubscribe :list-subscribe:list-post:list-owner:list-archive; t=1760456725; x=1761061525; bh=EGzOp1hNH2YGjylGaDpApn3mnW3SKP85mJmGO7ib1kg=; b=Xiyux3q4Dc NMHXyFi+wSc9j4dLPcptRiqXV54IwUsEuqQ41oF8BI209Mwqi+L0Mkdciht70o+FA0FOMOt30OE jdUI0+wcLKsQypuIKrPZrcexnZb6/jCzgrFHjvLKm5zMko1DufQwjl9+potYe0KPAlUssFIejMl N1Fqi6HtvAGtQUISlufpkX6Y0xFcj3k5eJtNmnV2/unX29gBq4QNaOFUP26bougAjRtljnJVWaa FGb7DKXIozDUmiCtO2b/hpaATxEHhCeYSFEVS16DHcsQrsvTXIh0Qcb2gW3O2vVLQ84ttLyuAgl pj18z8CsJD3TJhzD8Ed+FOvmzC7MieaQ==;",
    "arc-authentication-results": "i=1; mx.cloudflare.net; dkim=pass header.d=gmail.com header.s=20230601 header.b=htHN4I0+; dmarc=pass header.from=gmail.com policy.dmarc=none; spf=none (mx.cloudflare.net: no SPF records found for postmaster@mail-ed1-x529.google.com) smtp.helo=mail-ed1-x529.google.com; spf=pass (mx.cloudflare.net: domain of sayantan.das.gg@gmail.com designates 2a00:1450:4864:20::529 as permitted sender) smtp.mailfrom=sayantan.das.gg@gmail.com; arc=none smtp.remote-ip=2a00:1450:4864:20::529",
    "received-spf": "pass (mx.cloudflare.net: domain of sayantan.das.gg@gmail.com designates 2a00:1450:4864:20::529 as permitted sender) receiver=mx.cloudflare.net; client-ip=2a00:1450:4864:20::529; envelope-from=\"sayantan.das.gg@gmail.com\"; helo=mail-ed1-x529.google.com;",
    "authentication-results": "mx.cloudflare.net; dkim=pass header.d=gmail.com header.s=20230601 header.b=htHN4I0+; dmarc=pass header.from=gmail.com policy.dmarc=none; spf=none (mx.cloudflare.net: no SPF records found for postmaster@mail-ed1-x529.google.com) smtp.helo=mail-ed1-x529.google.com; spf=pass (mx.cloudflare.net: domain of sayantan.das.gg@gmail.com designates 2a00:1450:4864:20::529 as permitted sender) smtp.mailfrom=sayantan.das.gg@gmail.com; arc=none smtp.remote-ip=2a00:1450:4864:20::529",
    "dkim-signature": {
      value: "v=1",
      params: [Object ...],
    },
    "x-google-dkim-signature": "v=1; a=rsa-sha256; c=relaxed/relaxed; d=1e100.net; s=20230601; t=1760456725; x=1761061525; h=to:subject:message-id:date:from:in-reply-to:references:mime-version :x-gm-message-state:from:to:cc:subject:date:message-id:reply-to; bh=EGzOp1hNH2YGjylGaDpApn3mnW3SKP85mJmGO7ib1kg=; b=kz1YUhx94XIdoQGEhjIuMR57BMR2fJwcimUlIdaiWnW7Op5Et7pHKLGVYQ9O0j/Tmj 90GuVylnkVor7Ov4ThqY5lX/lgsd9F128d5Ic2GazTPPuEt+Lha0HdRUgV3Gullrmtyz ChuPZJHj51E1QQYKwFUEZPmOtBkzozjrzX+B8jP1joyJGv5HqepXTjfkVxIaQGeDHswn HbEJQPpjTn3Zm2zarT9lXg0mV1n5C/QxZlXPtGWTIk2Ko6w3FugB6XnIUD5X3v8fpZBD k4hMY+9xOfGjNIZnMUj+j3f/gLttLwOwfYfWiCjqZour9TsBfnoVsEVZO+JDT1U5USrk Fbmg==",
    "x-gm-message-state": "AOJu0YyYp5Ee8AuaUbD5HCV+/V62GC3N6BS43L/WSIfnQIf7FNr9PEzw 1F35BigX45Md4x/CNDk8hNhHoZOHRtPNrzG0xGT5s98Oj8HCrSq/5GRuwEv3HSpIuj11/VY54QV a0Tz92dOa+9feJI24t9BSq9H1p3w+YSYfJiynYWo=",
    "x-gm-gg": "ASbGncvKp8d1Zskv4wbQKUj+osSjXQmpMn8ublyK93ZhBhrSB87sbDj2ltfeH9O34ze mVZcT9pz7UnRzMhgkem0peIfag4U96oTs87w3GXn7Bb7Z4wUu1xhZQO9YSzyan7HwihVnsUXx1u n8gcQLtIgETihSlHRI6bky2YI6RumQrSxRCzZvB1lqHHXkqMyXb5CdMkcy+zezhaxK+4CdCUn0j /JVTbb/nj0VLixFTgDzQ4QMXE9BYNwcKW2j61ys1qAh557TDmjmqQXwgGG4",
    "x-google-smtp-source": "AGHT+IEyFQzi96FQYIpf8RbPlkGe9tL7SUwHiRALi7icYNcFxoWMa80sv8X67NMW2y+3L3a4T9SifxbUM6UHnyDlsLA=",
    "x-received": "by 2002:a05:6402:350a:b0:63a:690:8080 with SMTP id 4fb4d7f45d1cf-63a069082a3mr18655514a12.6.1760456724849; Tue, 14 Oct 2025 08:45:24 -0700 (PDT)",
    "mime-version": "1.0",
    "references": [
      "<CAGc4HzPTzB7V57-pe1tiyHxgwqmkf8_8CP16chBw=XQ7G8gAww@mail.gmail.com>", "<CAGc4HzORyWFivwy-v8WNzQhH-hTNiEo4AO7Jr_xVBx034g4V5w@mail.gmail.com>",
      "<CAGc4HzN84HuqhdJTKZNWhCNYQRiCJefnp8KAHo6oZBhuRX=DOQ@mail.gmail.com>"
    ],
    "in-reply-to": "<CAGc4HzN84HuqhdJTKZNWhCNYQRiCJefnp8KAHo6oZBhuRX=DOQ@mail.gmail.com>",
    "from": {
      value: [
        [Object ...]
      ],
      html: "<span class=\"mp_address_group\"><span class=\"mp_address_name\">Sayantan Das</span> &lt;<a href=\"mailto:sayantan.das.gg@gmail.com\" class=\"mp_address_email\">sayantan.das.gg@gmail.com</a>&gt;</span>",
      text: "\"Sayantan Das\" <sayantan.das.gg@gmail.com>",
    },
    "date": 2025-10-14T15:45:12.000Z,
    "x-gm-features": "AS18NWBwTImcC32vatcIevsd19sHN2bxOTFSAHB67CD44O45WtNLLubSbvL0Xcw",
    "message-id": "<CAGc4HzOm-f+K=TMc0DJYBMmi7pW_1uacsF=zM_bM4yWDS4+vYA@mail.gmail.com>",
    "subject": "Re: Peak cinema?",
    "to": {
      value: [
        [Object ...]
      ],
      html: "<span class=\"mp_address_group\"><a href=\"mailto:test@rovelstars.com\" class=\"mp_address_email\">test@rovelstars.com</a></span>",
      text: "test@rovelstars.com",
    },
    "content-type": {
      value: "multipart/alternative",
      params: [Object ...],
    },
  },
  headerLines: [
    {
      key: "received",
      line: "Received: from mail-ed1-x529.google.com (2a00:1450:4864:20::529)\r\n        by cloudflare-email.net (cloudflare) id kBEBjlW273cp\r\n        for <test@rovelstars.com>; Tue, 14 Oct 2025 15:45:25 +0000",
    },
    {
      key: "arc-seal",
      line: "ARC-Seal: i=1; a=rsa-sha256; s=cf2024-1; d=cloudflare-email.net; cv=none;\r\n\tb=di+HnGkJh4GCiwLYA1BkbPc3fnbsDHGRH+twIIWoxXc+QungYWA3uW1A01+GNdsskqa8Ph99/\r\n\tuO/GRUIPyfmhpUlCgvlxoaQfaWiNr0LNQpmUYwRSmL54H47Q4svh32yhuGkgdTfuzEV90A4YJA5\r\n\tN5k+yLwa8jN1tuLFlhVBjHEDmciKup/FUhIG60StU376VK651znCGWMAgdLDSH+GfEVabKaT5MN\r\n\tO2QHcMfXXvI5TZyUWWAIFd/aVQ4vK6Fq3y47X0bWkc68WXKuz0HPrtDm0ZOnGAq62j8U4xLTI2J\r\n\tLVzfSY1b02CSHtL/m2sdTgZkVhk7+g/Eys5UxClsimMw==;",
    },
    {
      key: "arc-message-signature",
      line: "ARC-Message-Signature: i=1; a=rsa-sha256; s=cf2024-1; d=cloudflare-email.net; c=relaxed/relaxed;\r\n\th=To:Subject:Date:From:In-Reply-To:References:reply-to:cc:resent-date\r\n\t:resent-from:resent-to:resent-cc:list-id:list-help:list-unsubscribe\r\n\t:list-subscribe:list-post:list-owner:list-archive; t=1760456725;\r\n\tx=1761061525; bh=EGzOp1hNH2YGjylGaDpApn3mnW3SKP85mJmGO7ib1kg=; b=Xiyux3q4Dc\r\n\tNMHXyFi+wSc9j4dLPcptRiqXV54IwUsEuqQ41oF8BI209Mwqi+L0Mkdciht70o+FA0FOMOt30OE\r\n\tjdUI0+wcLKsQypuIKrPZrcexnZb6/jCzgrFHjvLKm5zMko1DufQwjl9+potYe0KPAlUssFIejMl\r\n\tN1Fqi6HtvAGtQUISlufpkX6Y0xFcj3k5eJtNmnV2/unX29gBq4QNaOFUP26bougAjRtljnJVWaa\r\n\tFGb7DKXIozDUmiCtO2b/hpaATxEHhCeYSFEVS16DHcsQrsvTXIh0Qcb2gW3O2vVLQ84ttLyuAgl\r\n\tpj18z8CsJD3TJhzD8Ed+FOvmzC7MieaQ==;",
    },
    {
      key: "arc-authentication-results",
      line: "ARC-Authentication-Results: i=1; mx.cloudflare.net;\r\n\tdkim=pass header.d=gmail.com header.s=20230601 header.b=htHN4I0+;\r\n\tdmarc=pass header.from=gmail.com policy.dmarc=none;\r\n\tspf=none (mx.cloudflare.net: no SPF records found for postmaster@mail-ed1-x529.google.com) smtp.helo=mail-ed1-x529.google.com;\r\n\tspf=pass (mx.cloudflare.net: domain of sayantan.das.gg@gmail.com designates 2a00:1450:4864:20::529 as permitted sender) smtp.mailfrom=sayantan.das.gg@gmail.com;\r\n\tarc=none smtp.remote-ip=2a00:1450:4864:20::529",
    },
    {
      key: "received-spf",
      line: "Received-SPF: pass (mx.cloudflare.net: domain of sayantan.das.gg@gmail.com designates 2a00:1450:4864:20::529 as permitted sender)\r\n\treceiver=mx.cloudflare.net; client-ip=2a00:1450:4864:20::529; envelope-from=\"sayantan.das.gg@gmail.com\"; helo=mail-ed1-x529.google.com;",
    },
    {
      key: "authentication-results",
      line: "Authentication-Results: mx.cloudflare.net;\r\n\tdkim=pass header.d=gmail.com header.s=20230601 header.b=htHN4I0+;\r\n\tdmarc=pass header.from=gmail.com policy.dmarc=none;\r\n\tspf=none (mx.cloudflare.net: no SPF records found for postmaster@mail-ed1-x529.google.com) smtp.helo=mail-ed1-x529.google.com;\r\n\tspf=pass (mx.cloudflare.net: domain of sayantan.das.gg@gmail.com designates 2a00:1450:4864:20::529 as permitted sender) smtp.mailfrom=sayantan.das.gg@gmail.com;\r\n\tarc=none smtp.remote-ip=2a00:1450:4864:20::529",
    },
    {
      key: "received",
      line: "Received: by mail-ed1-x529.google.com with SMTP id 4fb4d7f45d1cf-63bd822b007so1496766a12.2\r\n        for <test@rovelstars.com>; Tue, 14 Oct 2025 08:45:25 -0700 (PDT)",
    },
    {
      key: "dkim-signature",
      line: "DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;\r\n        d=gmail.com; s=20230601; t=1760456725; x=1761061525; darn=rovelstars.com;\r\n        h=to:subject:message-id:date:from:in-reply-to:references:mime-version\r\n         :from:to:cc:subject:date:message-id:reply-to;\r\n        bh=EGzOp1hNH2YGjylGaDpApn3mnW3SKP85mJmGO7ib1kg=;\r\n        b=htHN4I0+yrdIb98STJiIe5D+o/VGWtI7vf9h0dks9w2jLyCaR9Y/4dZx7m/sN6NtXO\r\n         5h2qM3x9fwXPYdi+czLBxgN2ZFXB3WOHhV9AB6+NcGRKtI7kpob0JlB37wq1wzeJTAHe\r\n         ZMnTVik/3Cdl+JZXo8Gq5MjczruDNOoCzfvsvXqUWmiaGwqF5F8VApC+7Il3hQxdA3pM\r\n         d6Z63XiptRN/QS0tvBG7zmud4rCzZ6/kBmU9XKn3M9Yvkn0+3frxedUPM9A0zE8XyIVJ\r\n         qSdw8sQc6wJcgIB+A/bgahEGI1LS6QGBFnL6Bu2MjSZAFSBzyUFcK7o4hSKOjO1LaNZx\r\n         h3IA==",
    },
    {
      key: "x-google-dkim-signature",
      line: "X-Google-DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;\r\n        d=1e100.net; s=20230601; t=1760456725; x=1761061525;\r\n        h=to:subject:message-id:date:from:in-reply-to:references:mime-version\r\n         :x-gm-message-state:from:to:cc:subject:date:message-id:reply-to;\r\n        bh=EGzOp1hNH2YGjylGaDpApn3mnW3SKP85mJmGO7ib1kg=;\r\n        b=kz1YUhx94XIdoQGEhjIuMR57BMR2fJwcimUlIdaiWnW7Op5Et7pHKLGVYQ9O0j/Tmj\r\n         90GuVylnkVor7Ov4ThqY5lX/lgsd9F128d5Ic2GazTPPuEt+Lha0HdRUgV3Gullrmtyz\r\n         ChuPZJHj51E1QQYKwFUEZPmOtBkzozjrzX+B8jP1joyJGv5HqepXTjfkVxIaQGeDHswn\r\n         HbEJQPpjTn3Zm2zarT9lXg0mV1n5C/QxZlXPtGWTIk2Ko6w3FugB6XnIUD5X3v8fpZBD\r\n         k4hMY+9xOfGjNIZnMUj+j3f/gLttLwOwfYfWiCjqZour9TsBfnoVsEVZO+JDT1U5USrk\r\n         Fbmg==",
    },
    {
      key: "x-gm-message-state",
      line: "X-Gm-Message-State: AOJu0YyYp5Ee8AuaUbD5HCV+/V62GC3N6BS43L/WSIfnQIf7FNr9PEzw\r\n\t1F35BigX45Md4x/CNDk8hNhHoZOHRtPNrzG0xGT5s98Oj8HCrSq/5GRuwEv3HSpIuj11/VY54QV\r\n\ta0Tz92dOa+9feJI24t9BSq9H1p3w+YSYfJiynYWo=",
    },
    {
      key: "x-gm-gg",
      line: "X-Gm-Gg: ASbGncvKp8d1Zskv4wbQKUj+osSjXQmpMn8ublyK93ZhBhrSB87sbDj2ltfeH9O34ze\r\n\tmVZcT9pz7UnRzMhgkem0peIfag4U96oTs87w3GXn7Bb7Z4wUu1xhZQO9YSzyan7HwihVnsUXx1u\r\n\tn8gcQLtIgETihSlHRI6bky2YI6RumQrSxRCzZvB1lqHHXkqMyXb5CdMkcy+zezhaxK+4CdCUn0j\r\n\t/JVTbb/nj0VLixFTgDzQ4QMXE9BYNwcKW2j61ys1qAh557TDmjmqQXwgGG4",
    },
    {
      key: "x-google-smtp-source",
      line: "X-Google-Smtp-Source: AGHT+IEyFQzi96FQYIpf8RbPlkGe9tL7SUwHiRALi7icYNcFxoWMa80sv8X67NMW2y+3L3a4T9SifxbUM6UHnyDlsLA=",
    },
    {
      key: "x-received",
      line: "X-Received: by 2002:a05:6402:350a:b0:63a:690:8080 with SMTP id\r\n 4fb4d7f45d1cf-63a069082a3mr18655514a12.6.1760456724849; Tue, 14 Oct 2025\r\n 08:45:24 -0700 (PDT)",
    },
    {
      key: "mime-version",
      line: "MIME-Version: 1.0",
    }, {
      key: "references",
      line: "References: <CAGc4HzPTzB7V57-pe1tiyHxgwqmkf8_8CP16chBw=XQ7G8gAww@mail.gmail.com>\r\n <CAGc4HzORyWFivwy-v8WNzQhH-hTNiEo4AO7Jr_xVBx034g4V5w@mail.gmail.com> <CAGc4HzN84HuqhdJTKZNWhCNYQRiCJefnp8KAHo6oZBhuRX=DOQ@mail.gmail.com>",
    },
    {
      key: "in-reply-to",
      line: "In-Reply-To: <CAGc4HzN84HuqhdJTKZNWhCNYQRiCJefnp8KAHo6oZBhuRX=DOQ@mail.gmail.com>",
    },
    {
      key: "from",
      line: "From: Sayantan Das <sayantan.das.gg@gmail.com>",
    }, {
      key: "date",
      line: "Date: Tue, 14 Oct 2025 21:15:12 +0530",
    }, {
      key: "x-gm-features",
      line: "X-Gm-Features: AS18NWBwTImcC32vatcIevsd19sHN2bxOTFSAHB67CD44O45WtNLLubSbvL0Xcw",
    },
    {
      key: "message-id",
      line: "Message-ID: <CAGc4HzOm-f+K=TMc0DJYBMmi7pW_1uacsF=zM_bM4yWDS4+vYA@mail.gmail.com>",
    },
    {
      key: "subject",
      line: "Subject: Re: Peak cinema?",
    }, {
      key: "to",
      line: "To: test@rovelstars.com",
    }, {
      key: "content-type",
      line: "Content-Type: multipart/alternative; boundary=\"000000000000ba2bbe06412045b9\"",
    }
  ],
  html: "<div dir=\"auto\">Last one hopefully</div><br><div class=\"gmail_quote gmail_quote_container\"><div dir=\"ltr\" class=\"gmail_attr\">On Tue, 14 Oct, 2025, 8:45 pm Sayantan Das, &lt;<a href=\"mailto:sayantan.das.gg@gmail.com\">sayantan.das.gg@gmail.com</a>&gt; wrote:<br></div><blockquote class=\"gmail_quote\" style=\"margin:0 0 0 .8ex;border-left:1px #ccc solid;padding-left:1ex\"><div dir=\"auto\">Hmm</div><br><div class=\"gmail_quote\"><div dir=\"ltr\" class=\"gmail_attr\">On Tue, 14 Oct, 2025, 8:44 pm Sayantan Das, &lt;<a href=\"mailto:sayantan.das.gg@gmail.com\" target=\"_blank\" rel=\"noreferrer\">sayantan.das.gg@gmail.com</a>&gt; wrote:<br></div><blockquote class=\"gmail_quote\" style=\"margin:0 0 0 .8ex;border-left:1px #ccc solid;padding-left:1ex\"><div dir=\"auto\">Hmm</div><br><div class=\"gmail_quote\"><div dir=\"ltr\" class=\"gmail_attr\">On Tue, 14 Oct, 2025, 8:43 pm Sayantan Das, &lt;<a href=\"mailto:sayantan.das.gg@gmail.com\" rel=\"noreferrer noreferrer\" target=\"_blank\">sayantan.das.gg@gmail.com</a>&gt; wrote:<br></div><blockquote class=\"gmail_quote\" style=\"margin:0 0 0 .8ex;border-left:1px #ccc solid;padding-left:1ex\"><div dir=\"auto\">I know right?</div>\n</blockquote></div>\n</blockquote></div>\n</blockquote></div>\n",
  text: "Last one hopefully\n\nOn Tue, 14 Oct, 2025, 8:45 pm Sayantan Das, <sayantan.das.gg@gmail.com>\nwrote:\n\n> Hmm\n>\n> On Tue, 14 Oct, 2025, 8:44 pm Sayantan Das, <sayantan.das.gg@gmail.com>\n> wrote:\n>\n>> Hmm\n>>\n>> On Tue, 14 Oct, 2025, 8:43 pm Sayantan Das, <sayantan.das.gg@gmail.com>\n>> wrote:\n>>\n>>> I know right?\n>>>\n>>\n",
  textAsHtml: "<p>Last one hopefully</p><p>On Tue, 14 Oct, 2025, 8:45&#x202F;pm Sayantan Das, &lt;<a href=\"mailto:sayantan.das.gg@gmail.com\">sayantan.das.gg@gmail.com</a>&gt;<br/>wrote:</p><p>&gt; Hmm<br/>&gt;<br/>&gt; On Tue, 14 Oct, 2025, 8:44&#x202F;pm Sayantan Das, &lt;<a href=\"mailto:sayantan.das.gg@gmail.com\">sayantan.das.gg@gmail.com</a>&gt;<br/>&gt; wrote:<br/>&gt;<br/>&gt;&gt; Hmm<br/>&gt;&gt;<br/>&gt;&gt; On Tue, 14 Oct, 2025, 8:43&#x202F;pm Sayantan Das, &lt;<a href=\"mailto:sayantan.das.gg@gmail.com\">sayantan.das.gg@gmail.com</a>&gt;<br/>&gt;&gt; wrote:<br/>&gt;&gt;<br/>&gt;&gt;&gt; I know right?<br/>&gt;&gt;&gt;<br/>&gt;&gt;</p>",
  subject: "Re: Peak cinema?",
  references: [ "<CAGc4HzPTzB7V57-pe1tiyHxgwqmkf8_8CP16chBw=XQ7G8gAww@mail.gmail.com>",
    "<CAGc4HzORyWFivwy-v8WNzQhH-hTNiEo4AO7Jr_xVBx034g4V5w@mail.gmail.com>", "<CAGc4HzN84HuqhdJTKZNWhCNYQRiCJefnp8KAHo6oZBhuRX=DOQ@mail.gmail.com>"
  ],
  date: 2025-10-14T15:45:12.000Z,
  to: {
    value: [
      [Object ...]
    ],
    html: "<span class=\"mp_address_group\"><a href=\"mailto:test@rovelstars.com\" class=\"mp_address_email\">test@rovelstars.com</a></span>",
    text: "test@rovelstars.com",
  },
  from: {
    value: [
      [Object ...]
    ],
    html: "<span class=\"mp_address_group\"><span class=\"mp_address_name\">Sayantan Das</span> &lt;<a href=\"mailto:sayantan.das.gg@gmail.com\" class=\"mp_address_email\">sayantan.das.gg@gmail.com</a>&gt;</span>",
    text: "\"Sayantan Das\" <sayantan.das.gg@gmail.com>",
  },
  messageId: "<CAGc4HzOm-f+K=TMc0DJYBMmi7pW_1uacsF=zM_bM4yWDS4+vYA@mail.gmail.com>",
  inReplyTo: "<CAGc4HzN84HuqhdJTKZNWhCNYQRiCJefnp8KAHo6oZBhuRX=DOQ@mail.gmail.com>",
}

import { simpleParser } from "mailparser";

const result = await simpleParser(data.message.raw);
console.log(JSON.stringify(result, null, 2));
