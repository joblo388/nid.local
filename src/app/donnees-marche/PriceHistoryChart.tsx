"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type YearData = {
  year: number;
  unifamiliale: number | null;
  condo: number | null;
  plex: number | null;
};

// ─── Données historiques statiques par quartier ────────────────────────────────
const priceHistory: Record<string, YearData[]> = {
  // ── Montréal ──────────────────────────────────────────────────────────────
  "plateau-mont-royal": [
    { year: 2020, unifamiliale: 720000, condo: 365000, plex: 1050000 },
    { year: 2021, unifamiliale: 795000, condo: 395000, plex: 1150000 },
    { year: 2022, unifamiliale: 870000, condo: 420000, plex: 1260000 },
    { year: 2023, unifamiliale: 895000, condo: 435000, plex: 1290000 },
    { year: 2024, unifamiliale: 930000, condo: 460000, plex: 1345000 },
    { year: 2025, unifamiliale: 955000, condo: 480000, plex: 1385000 },
    { year: 2026, unifamiliale: 985000, condo: 495000, plex: 1425000 },
  ],
  "rosemont": [
    { year: 2020, unifamiliale: 580000, condo: 310000, plex: 850000 },
    { year: 2021, unifamiliale: 640000, condo: 335000, plex: 935000 },
    { year: 2022, unifamiliale: 710000, condo: 365000, plex: 1025000 },
    { year: 2023, unifamiliale: 735000, condo: 380000, plex: 1065000 },
    { year: 2024, unifamiliale: 770000, condo: 400000, plex: 1110000 },
    { year: 2025, unifamiliale: 795000, condo: 412000, plex: 1145000 },
    { year: 2026, unifamiliale: 825000, condo: 425000, plex: 1185000 },
  ],
  "villeray": [
    { year: 2020, unifamiliale: 430000, condo: 245000, plex: 625000 },
    { year: 2021, unifamiliale: 475000, condo: 265000, plex: 690000 },
    { year: 2022, unifamiliale: 530000, condo: 290000, plex: 770000 },
    { year: 2023, unifamiliale: 560000, condo: 305000, plex: 810000 },
    { year: 2024, unifamiliale: 595000, condo: 320000, plex: 860000 },
    { year: 2025, unifamiliale: 620000, condo: 335000, plex: 890000 },
    { year: 2026, unifamiliale: 645000, condo: 345000, plex: 925000 },
  ],
  "griffintown": [
    { year: 2020, unifamiliale: 465000, condo: 280000, plex: 660000 },
    { year: 2021, unifamiliale: 510000, condo: 305000, plex: 725000 },
    { year: 2022, unifamiliale: 565000, condo: 335000, plex: 810000 },
    { year: 2023, unifamiliale: 600000, condo: 350000, plex: 855000 },
    { year: 2024, unifamiliale: 640000, condo: 370000, plex: 910000 },
    { year: 2025, unifamiliale: 670000, condo: 385000, plex: 950000 },
    { year: 2026, unifamiliale: 695000, condo: 395000, plex: 985000 },
  ],
  "saint-henri": [
    { year: 2020, unifamiliale: 465000, condo: 280000, plex: 660000 },
    { year: 2021, unifamiliale: 510000, condo: 305000, plex: 725000 },
    { year: 2022, unifamiliale: 565000, condo: 335000, plex: 810000 },
    { year: 2023, unifamiliale: 600000, condo: 350000, plex: 855000 },
    { year: 2024, unifamiliale: 640000, condo: 370000, plex: 910000 },
    { year: 2025, unifamiliale: 670000, condo: 385000, plex: 950000 },
    { year: 2026, unifamiliale: 695000, condo: 395000, plex: 985000 },
  ],
  "hochelaga": [
    { year: 2020, unifamiliale: 365000, condo: 215000, plex: 530000 },
    { year: 2021, unifamiliale: 400000, condo: 235000, plex: 585000 },
    { year: 2022, unifamiliale: 445000, condo: 260000, plex: 655000 },
    { year: 2023, unifamiliale: 475000, condo: 278000, plex: 700000 },
    { year: 2024, unifamiliale: 515000, condo: 300000, plex: 755000 },
    { year: 2025, unifamiliale: 540000, condo: 315000, plex: 790000 },
    { year: 2026, unifamiliale: 565000, condo: 325000, plex: 825000 },
  ],
  "cote-des-neiges": [
    { year: 2020, unifamiliale: 575000, condo: 310000, plex: 820000 },
    { year: 2021, unifamiliale: 625000, condo: 335000, plex: 890000 },
    { year: 2022, unifamiliale: 685000, condo: 365000, plex: 975000 },
    { year: 2023, unifamiliale: 715000, condo: 385000, plex: 1020000 },
    { year: 2024, unifamiliale: 750000, condo: 405000, plex: 1065000 },
    { year: 2025, unifamiliale: 775000, condo: 415000, plex: 1095000 },
    { year: 2026, unifamiliale: 795000, condo: 425000, plex: 1125000 },
  ],
  "notre-dame-de-grace": [
    { year: 2020, unifamiliale: 575000, condo: 310000, plex: 820000 },
    { year: 2021, unifamiliale: 625000, condo: 335000, plex: 890000 },
    { year: 2022, unifamiliale: 685000, condo: 365000, plex: 975000 },
    { year: 2023, unifamiliale: 715000, condo: 385000, plex: 1020000 },
    { year: 2024, unifamiliale: 750000, condo: 405000, plex: 1065000 },
    { year: 2025, unifamiliale: 775000, condo: 415000, plex: 1095000 },
    { year: 2026, unifamiliale: 795000, condo: 425000, plex: 1125000 },
  ],
  "outremont": [
    { year: 2020, unifamiliale: 1200000, condo: 495000, plex: 1720000 },
    { year: 2021, unifamiliale: 1280000, condo: 525000, plex: 1830000 },
    { year: 2022, unifamiliale: 1370000, condo: 560000, plex: 1950000 },
    { year: 2023, unifamiliale: 1405000, condo: 580000, plex: 2000000 },
    { year: 2024, unifamiliale: 1440000, condo: 600000, plex: 2055000 },
    { year: 2025, unifamiliale: 1465000, condo: 615000, plex: 2090000 },
    { year: 2026, unifamiliale: 1485000, condo: 625000, plex: 2125000 },
  ],
  "vieux-montreal": [
    { year: 2020, unifamiliale: null, condo: 395000, plex: null },
    { year: 2021, unifamiliale: null, condo: 420000, plex: null },
    { year: 2022, unifamiliale: null, condo: 460000, plex: null },
    { year: 2023, unifamiliale: null, condo: 480000, plex: null },
    { year: 2024, unifamiliale: null, condo: 500000, plex: null },
    { year: 2025, unifamiliale: null, condo: 515000, plex: null },
    { year: 2026, unifamiliale: null, condo: 525000, plex: null },
  ],
  "verdun": [
    { year: 2020, unifamiliale: 415000, condo: 255000, plex: 600000 },
    { year: 2021, unifamiliale: 460000, condo: 275000, plex: 665000 },
    { year: 2022, unifamiliale: 515000, condo: 305000, plex: 745000 },
    { year: 2023, unifamiliale: 545000, condo: 325000, plex: 790000 },
    { year: 2024, unifamiliale: 580000, condo: 345000, plex: 840000 },
    { year: 2025, unifamiliale: 605000, condo: 355000, plex: 870000 },
    { year: 2026, unifamiliale: 625000, condo: 365000, plex: 895000 },
  ],
  "mile-end": [
    { year: 2020, unifamiliale: 680000, condo: 350000, plex: 985000 },
    { year: 2021, unifamiliale: 740000, condo: 378000, plex: 1075000 },
    { year: 2022, unifamiliale: 810000, condo: 410000, plex: 1175000 },
    { year: 2023, unifamiliale: 845000, condo: 430000, plex: 1225000 },
    { year: 2024, unifamiliale: 885000, condo: 450000, plex: 1285000 },
    { year: 2025, unifamiliale: 908000, condo: 465000, plex: 1320000 },
    { year: 2026, unifamiliale: 925000, condo: 475000, plex: 1350000 },
  ],
  "petite-bourgogne": [
    { year: 2020, unifamiliale: 450000, condo: 270000, plex: 645000 },
    { year: 2021, unifamiliale: 495000, condo: 292000, plex: 710000 },
    { year: 2022, unifamiliale: 550000, condo: 325000, plex: 795000 },
    { year: 2023, unifamiliale: 585000, condo: 345000, plex: 840000 },
    { year: 2024, unifamiliale: 625000, condo: 365000, plex: 895000 },
    { year: 2025, unifamiliale: 652000, condo: 375000, plex: 935000 },
    { year: 2026, unifamiliale: 675000, condo: 385000, plex: 965000 },
  ],
  "pointe-saint-charles": [
    { year: 2020, unifamiliale: 390000, condo: 240000, plex: 565000 },
    { year: 2021, unifamiliale: 430000, condo: 260000, plex: 625000 },
    { year: 2022, unifamiliale: 480000, condo: 290000, plex: 700000 },
    { year: 2023, unifamiliale: 510000, condo: 308000, plex: 740000 },
    { year: 2024, unifamiliale: 545000, condo: 325000, plex: 790000 },
    { year: 2025, unifamiliale: 572000, condo: 338000, plex: 825000 },
    { year: 2026, unifamiliale: 595000, condo: 345000, plex: 855000 },
  ],
  "saint-laurent": [
    { year: 2020, unifamiliale: 475000, condo: 260000, plex: 645000 },
    { year: 2021, unifamiliale: 520000, condo: 280000, plex: 710000 },
    { year: 2022, unifamiliale: 575000, condo: 310000, plex: 790000 },
    { year: 2023, unifamiliale: 610000, condo: 330000, plex: 835000 },
    { year: 2024, unifamiliale: 645000, condo: 348000, plex: 880000 },
    { year: 2025, unifamiliale: 665000, condo: 358000, plex: 905000 },
    { year: 2026, unifamiliale: 685000, condo: 365000, plex: 925000 },
  ],
  "montreal-nord": [
    { year: 2020, unifamiliale: 275000, condo: 175000, plex: 405000 },
    { year: 2021, unifamiliale: 305000, condo: 192000, plex: 450000 },
    { year: 2022, unifamiliale: 345000, condo: 218000, plex: 510000 },
    { year: 2023, unifamiliale: 370000, condo: 235000, plex: 545000 },
    { year: 2024, unifamiliale: 395000, condo: 250000, plex: 585000 },
    { year: 2025, unifamiliale: 412000, condo: 258000, plex: 608000 },
    { year: 2026, unifamiliale: 425000, condo: 265000, plex: 625000 },
  ],
  "anjou": [
    { year: 2020, unifamiliale: 355000, condo: 215000, plex: 510000 },
    { year: 2021, unifamiliale: 385000, condo: 232000, plex: 555000 },
    { year: 2022, unifamiliale: 420000, condo: 255000, plex: 610000 },
    { year: 2023, unifamiliale: 440000, condo: 268000, plex: 640000 },
    { year: 2024, unifamiliale: 460000, condo: 280000, plex: 668000 },
    { year: 2025, unifamiliale: 475000, condo: 290000, plex: 685000 },
    { year: 2026, unifamiliale: 485000, condo: 295000, plex: 695000 },
  ],
  "saint-leonard": [
    { year: 2020, unifamiliale: 380000, condo: 225000, plex: 545000 },
    { year: 2021, unifamiliale: 412000, condo: 245000, plex: 592000 },
    { year: 2022, unifamiliale: 450000, condo: 268000, plex: 650000 },
    { year: 2023, unifamiliale: 472000, condo: 282000, plex: 685000 },
    { year: 2024, unifamiliale: 498000, condo: 298000, plex: 718000 },
    { year: 2025, unifamiliale: 512000, condo: 308000, plex: 732000 },
    { year: 2026, unifamiliale: 525000, condo: 315000, plex: 745000 },
  ],
  "lasalle": [
    { year: 2020, unifamiliale: 375000, condo: 228000, plex: 548000 },
    { year: 2021, unifamiliale: 412000, condo: 248000, plex: 605000 },
    { year: 2022, unifamiliale: 455000, condo: 275000, plex: 672000 },
    { year: 2023, unifamiliale: 480000, condo: 292000, plex: 710000 },
    { year: 2024, unifamiliale: 510000, condo: 308000, plex: 755000 },
    { year: 2025, unifamiliale: 530000, condo: 318000, plex: 778000 },
    { year: 2026, unifamiliale: 545000, condo: 325000, plex: 795000 },
  ],
  "lachine": [
    { year: 2020, unifamiliale: 360000, condo: 220000, plex: 525000 },
    { year: 2021, unifamiliale: 395000, condo: 240000, plex: 580000 },
    { year: 2022, unifamiliale: 438000, condo: 268000, plex: 648000 },
    { year: 2023, unifamiliale: 462000, condo: 282000, plex: 682000 },
    { year: 2024, unifamiliale: 492000, condo: 298000, plex: 725000 },
    { year: 2025, unifamiliale: 510000, condo: 308000, plex: 748000 },
    { year: 2026, unifamiliale: 525000, condo: 315000, plex: 765000 },
  ],
  "riviere-des-prairies": [
    { year: 2020, unifamiliale: 325000, condo: 198000, plex: 478000 },
    { year: 2021, unifamiliale: 358000, condo: 218000, plex: 528000 },
    { year: 2022, unifamiliale: 395000, condo: 242000, plex: 588000 },
    { year: 2023, unifamiliale: 418000, condo: 258000, plex: 622000 },
    { year: 2024, unifamiliale: 440000, condo: 272000, plex: 655000 },
    { year: 2025, unifamiliale: 455000, condo: 280000, plex: 672000 },
    { year: 2026, unifamiliale: 465000, condo: 285000, plex: 685000 },
  ],
  "dollard-des-ormeaux": [
    { year: 2020, unifamiliale: 435000, condo: 240000, plex: null },
    { year: 2021, unifamiliale: 472000, condo: 258000, plex: null },
    { year: 2022, unifamiliale: 518000, condo: 285000, plex: null },
    { year: 2023, unifamiliale: 545000, condo: 302000, plex: null },
    { year: 2024, unifamiliale: 572000, condo: 318000, plex: null },
    { year: 2025, unifamiliale: 585000, condo: 328000, plex: null },
    { year: 2026, unifamiliale: 595000, condo: 335000, plex: null },
  ],
  "mont-royal": [
    { year: 2020, unifamiliale: 985000, condo: 395000, plex: null },
    { year: 2021, unifamiliale: 1045000, condo: 420000, plex: null },
    { year: 2022, unifamiliale: 1120000, condo: 458000, plex: null },
    { year: 2023, unifamiliale: 1160000, condo: 485000, plex: null },
    { year: 2024, unifamiliale: 1205000, condo: 515000, plex: null },
    { year: 2025, unifamiliale: 1230000, condo: 532000, plex: null },
    { year: 2026, unifamiliale: 1250000, condo: 545000, plex: null },
  ],
  "westmount": [
    { year: 2020, unifamiliale: 1350000, condo: 520000, plex: null },
    { year: 2021, unifamiliale: 1420000, condo: 548000, plex: null },
    { year: 2022, unifamiliale: 1510000, condo: 590000, plex: null },
    { year: 2023, unifamiliale: 1555000, condo: 620000, plex: null },
    { year: 2024, unifamiliale: 1600000, condo: 652000, plex: null },
    { year: 2025, unifamiliale: 1628000, condo: 670000, plex: null },
    { year: 2026, unifamiliale: 1650000, condo: 685000, plex: null },
  ],
  // ── Québec ────────────────────────────────────────────────────────────────
  "saint-sauveur-qc": [
    { year: 2020, unifamiliale: 245000, condo: 125000, plex: null },
    { year: 2021, unifamiliale: 278000, condo: 138000, plex: null },
    { year: 2022, unifamiliale: 325000, condo: 155000, plex: null },
    { year: 2023, unifamiliale: 360000, condo: 168000, plex: null },
    { year: 2024, unifamiliale: 392000, condo: 180000, plex: null },
    { year: 2025, unifamiliale: 410000, condo: 188000, plex: null },
    { year: 2026, unifamiliale: 425000, condo: 195000, plex: null },
  ],
  "limoilou": [
    { year: 2020, unifamiliale: 258000, condo: 130000, plex: null },
    { year: 2021, unifamiliale: 295000, condo: 145000, plex: null },
    { year: 2022, unifamiliale: 345000, condo: 165000, plex: null },
    { year: 2023, unifamiliale: 382000, condo: 178000, plex: null },
    { year: 2024, unifamiliale: 418000, condo: 192000, plex: null },
    { year: 2025, unifamiliale: 438000, condo: 200000, plex: null },
    { year: 2026, unifamiliale: 455000, condo: 205000, plex: null },
  ],
  "vieux-port-qc": [
    { year: 2020, unifamiliale: null, condo: 175000, plex: null },
    { year: 2021, unifamiliale: null, condo: 195000, plex: null },
    { year: 2022, unifamiliale: null, condo: 218000, plex: null },
    { year: 2023, unifamiliale: null, condo: 235000, plex: null },
    { year: 2024, unifamiliale: null, condo: 250000, plex: null },
    { year: 2025, unifamiliale: null, condo: 258000, plex: null },
    { year: 2026, unifamiliale: null, condo: 265000, plex: null },
  ],
  "saint-roch": [
    { year: 2020, unifamiliale: 272000, condo: 142000, plex: null },
    { year: 2021, unifamiliale: 310000, condo: 158000, plex: null },
    { year: 2022, unifamiliale: 362000, condo: 180000, plex: null },
    { year: 2023, unifamiliale: 398000, condo: 195000, plex: null },
    { year: 2024, unifamiliale: 438000, condo: 210000, plex: null },
    { year: 2025, unifamiliale: 458000, condo: 218000, plex: null },
    { year: 2026, unifamiliale: 475000, condo: 225000, plex: null },
  ],
  "haute-ville": [
    { year: 2020, unifamiliale: 310000, condo: 158000, plex: null },
    { year: 2021, unifamiliale: 348000, condo: 175000, plex: null },
    { year: 2022, unifamiliale: 400000, condo: 198000, plex: null },
    { year: 2023, unifamiliale: 438000, condo: 215000, plex: null },
    { year: 2024, unifamiliale: 478000, condo: 230000, plex: null },
    { year: 2025, unifamiliale: 505000, condo: 240000, plex: null },
    { year: 2026, unifamiliale: 525000, condo: 245000, plex: null },
  ],
  "sainte-foy": [
    { year: 2020, unifamiliale: 335000, condo: 165000, plex: null },
    { year: 2021, unifamiliale: 375000, condo: 182000, plex: null },
    { year: 2022, unifamiliale: 430000, condo: 205000, plex: null },
    { year: 2023, unifamiliale: 475000, condo: 222000, plex: null },
    { year: 2024, unifamiliale: 525000, condo: 238000, plex: null },
    { year: 2025, unifamiliale: 552000, condo: 248000, plex: null },
    { year: 2026, unifamiliale: 575000, condo: 255000, plex: null },
  ],
  "charlesbourg": [
    { year: 2020, unifamiliale: 278000, condo: 138000, plex: null },
    { year: 2021, unifamiliale: 312000, condo: 152000, plex: null },
    { year: 2022, unifamiliale: 362000, condo: 172000, plex: null },
    { year: 2023, unifamiliale: 400000, condo: 188000, plex: null },
    { year: 2024, unifamiliale: 448000, condo: 202000, plex: null },
    { year: 2025, unifamiliale: 468000, condo: 210000, plex: null },
    { year: 2026, unifamiliale: 485000, condo: 215000, plex: null },
  ],
  "beauport": [
    { year: 2020, unifamiliale: 282000, condo: 140000, plex: null },
    { year: 2021, unifamiliale: 318000, condo: 155000, plex: null },
    { year: 2022, unifamiliale: 370000, condo: 178000, plex: null },
    { year: 2023, unifamiliale: 410000, condo: 192000, plex: null },
    { year: 2024, unifamiliale: 455000, condo: 208000, plex: null },
    { year: 2025, unifamiliale: 478000, condo: 215000, plex: null },
    { year: 2026, unifamiliale: 495000, condo: 220000, plex: null },
  ],
  // ── Laval ─────────────────────────────────────────────────────────────────
  "chomedey": [
    { year: 2020, unifamiliale: 405000, condo: 258000, plex: 595000 },
    { year: 2021, unifamiliale: 442000, condo: 278000, plex: 648000 },
    { year: 2022, unifamiliale: 490000, condo: 308000, plex: 718000 },
    { year: 2023, unifamiliale: 518000, condo: 328000, plex: 758000 },
    { year: 2024, unifamiliale: 548000, condo: 345000, plex: 798000 },
    { year: 2025, unifamiliale: 565000, condo: 355000, plex: 820000 },
    { year: 2026, unifamiliale: 575000, condo: 360000, plex: 835000 },
  ],
  "sainte-rose": [
    { year: 2020, unifamiliale: 435000, condo: 275000, plex: null },
    { year: 2021, unifamiliale: 475000, condo: 298000, plex: null },
    { year: 2022, unifamiliale: 528000, condo: 332000, plex: null },
    { year: 2023, unifamiliale: 558000, condo: 352000, plex: null },
    { year: 2024, unifamiliale: 590000, condo: 372000, plex: null },
    { year: 2025, unifamiliale: 608000, condo: 382000, plex: null },
    { year: 2026, unifamiliale: 620000, condo: 390000, plex: null },
  ],
  "vimont": [
    { year: 2020, unifamiliale: 392000, condo: 260000, plex: null },
    { year: 2021, unifamiliale: 428000, condo: 282000, plex: null },
    { year: 2022, unifamiliale: 478000, condo: 315000, plex: null },
    { year: 2023, unifamiliale: 508000, condo: 335000, plex: null },
    { year: 2024, unifamiliale: 538000, condo: 352000, plex: null },
    { year: 2025, unifamiliale: 552000, condo: 362000, plex: null },
    { year: 2026, unifamiliale: 565000, condo: 370000, plex: null },
  ],
  "auteuil": [
    { year: 2020, unifamiliale: 385000, condo: 255000, plex: null },
    { year: 2021, unifamiliale: 420000, condo: 278000, plex: null },
    { year: 2022, unifamiliale: 468000, condo: 310000, plex: null },
    { year: 2023, unifamiliale: 498000, condo: 330000, plex: null },
    { year: 2024, unifamiliale: 528000, condo: 348000, plex: null },
    { year: 2025, unifamiliale: 542000, condo: 358000, plex: null },
    { year: 2026, unifamiliale: 555000, condo: 365000, plex: null },
  ],
  "duvernay": [
    { year: 2020, unifamiliale: 378000, condo: 248000, plex: null },
    { year: 2021, unifamiliale: 412000, condo: 270000, plex: null },
    { year: 2022, unifamiliale: 458000, condo: 302000, plex: null },
    { year: 2023, unifamiliale: 488000, condo: 322000, plex: null },
    { year: 2024, unifamiliale: 518000, condo: 340000, plex: null },
    { year: 2025, unifamiliale: 532000, condo: 348000, plex: null },
    { year: 2026, unifamiliale: 545000, condo: 355000, plex: null },
  ],
  "fabreville": [
    { year: 2020, unifamiliale: 388000, condo: 252000, plex: null },
    { year: 2021, unifamiliale: 425000, condo: 275000, plex: null },
    { year: 2022, unifamiliale: 472000, condo: 306000, plex: null },
    { year: 2023, unifamiliale: 502000, condo: 325000, plex: null },
    { year: 2024, unifamiliale: 532000, condo: 342000, plex: null },
    { year: 2025, unifamiliale: 548000, condo: 352000, plex: null },
    { year: 2026, unifamiliale: 560000, condo: 360000, plex: null },
  ],
  // ── Longueuil ─────────────────────────────────────────────────────────────
  "vieux-longueuil": [
    { year: 2020, unifamiliale: 365000, condo: 235000, plex: 545000 },
    { year: 2021, unifamiliale: 400000, condo: 255000, plex: 600000 },
    { year: 2022, unifamiliale: 445000, condo: 285000, plex: 668000 },
    { year: 2023, unifamiliale: 470000, condo: 302000, plex: 705000 },
    { year: 2024, unifamiliale: 498000, condo: 320000, plex: 742000 },
    { year: 2025, unifamiliale: 512000, condo: 328000, plex: 760000 },
    { year: 2026, unifamiliale: 525000, condo: 335000, plex: 775000 },
  ],
  "saint-hubert": [
    { year: 2020, unifamiliale: 390000, condo: 248000, plex: null },
    { year: 2021, unifamiliale: 428000, condo: 270000, plex: null },
    { year: 2022, unifamiliale: 478000, condo: 302000, plex: null },
    { year: 2023, unifamiliale: 508000, condo: 322000, plex: null },
    { year: 2024, unifamiliale: 538000, condo: 340000, plex: null },
    { year: 2025, unifamiliale: 552000, condo: 348000, plex: null },
    { year: 2026, unifamiliale: 565000, condo: 355000, plex: null },
  ],
  "greenfield-park": [
    { year: 2020, unifamiliale: 372000, condo: 238000, plex: null },
    { year: 2021, unifamiliale: 408000, condo: 258000, plex: null },
    { year: 2022, unifamiliale: 452000, condo: 288000, plex: null },
    { year: 2023, unifamiliale: 480000, condo: 308000, plex: null },
    { year: 2024, unifamiliale: 508000, condo: 325000, plex: null },
    { year: 2025, unifamiliale: 522000, condo: 332000, plex: null },
    { year: 2026, unifamiliale: 535000, condo: 340000, plex: null },
  ],
  "brossard": [
    { year: 2020, unifamiliale: 435000, condo: 278000, plex: 628000 },
    { year: 2021, unifamiliale: 475000, condo: 302000, plex: 688000 },
    { year: 2022, unifamiliale: 530000, condo: 338000, plex: 768000 },
    { year: 2023, unifamiliale: 560000, condo: 358000, plex: 810000 },
    { year: 2024, unifamiliale: 595000, condo: 378000, plex: 858000 },
    { year: 2025, unifamiliale: 612000, condo: 388000, plex: 878000 },
    { year: 2026, unifamiliale: 625000, condo: 395000, plex: 895000 },
  ],
  // ── Sherbrooke ────────────────────────────────────────────────────────────
  "fleurimont": [
    { year: 2020, unifamiliale: 295000, condo: 192000, plex: null },
    { year: 2021, unifamiliale: 325000, condo: 210000, plex: null },
    { year: 2022, unifamiliale: 365000, condo: 238000, plex: null },
    { year: 2023, unifamiliale: 395000, condo: 255000, plex: null },
    { year: 2024, unifamiliale: 425000, condo: 272000, plex: null },
    { year: 2025, unifamiliale: 442000, condo: 282000, plex: null },
    { year: 2026, unifamiliale: 455000, condo: 290000, plex: null },
  ],
  "jacques-cartier-shbk": [
    { year: 2020, unifamiliale: 302000, condo: 198000, plex: null },
    { year: 2021, unifamiliale: 332000, condo: 218000, plex: null },
    { year: 2022, unifamiliale: 375000, condo: 248000, plex: null },
    { year: 2023, unifamiliale: 405000, condo: 265000, plex: null },
    { year: 2024, unifamiliale: 435000, condo: 282000, plex: null },
    { year: 2025, unifamiliale: 452000, condo: 292000, plex: null },
    { year: 2026, unifamiliale: 465000, condo: 300000, plex: null },
  ],
  "mont-bellevue": [
    { year: 2020, unifamiliale: 312000, condo: 202000, plex: null },
    { year: 2021, unifamiliale: 342000, condo: 222000, plex: null },
    { year: 2022, unifamiliale: 385000, condo: 252000, plex: null },
    { year: 2023, unifamiliale: 415000, condo: 270000, plex: null },
    { year: 2024, unifamiliale: 445000, condo: 288000, plex: null },
    { year: 2025, unifamiliale: 462000, condo: 298000, plex: null },
    { year: 2026, unifamiliale: 475000, condo: 305000, plex: null },
  ],
  "rock-forest": [
    { year: 2020, unifamiliale: 318000, condo: 205000, plex: null },
    { year: 2021, unifamiliale: 350000, condo: 225000, plex: null },
    { year: 2022, unifamiliale: 395000, condo: 258000, plex: null },
    { year: 2023, unifamiliale: 425000, condo: 275000, plex: null },
    { year: 2024, unifamiliale: 455000, condo: 292000, plex: null },
    { year: 2025, unifamiliale: 472000, condo: 302000, plex: null },
    { year: 2026, unifamiliale: 485000, condo: 310000, plex: null },
  ],
  // ── Gatineau ──────────────────────────────────────────────────────────────
  "hull": [
    { year: 2020, unifamiliale: 425000, condo: 232000, plex: null },
    { year: 2021, unifamiliale: 468000, condo: 252000, plex: null },
    { year: 2022, unifamiliale: 510000, condo: 272000, plex: null },
    { year: 2023, unifamiliale: 525000, condo: 280000, plex: null },
    { year: 2024, unifamiliale: 535000, condo: 288000, plex: null },
    { year: 2025, unifamiliale: 540000, condo: 292000, plex: null },
    { year: 2026, unifamiliale: 545000, condo: 295000, plex: null },
  ],
  "aylmer": [
    { year: 2020, unifamiliale: 445000, condo: 238000, plex: null },
    { year: 2021, unifamiliale: 490000, condo: 258000, plex: null },
    { year: 2022, unifamiliale: 535000, condo: 278000, plex: null },
    { year: 2023, unifamiliale: 550000, condo: 288000, plex: null },
    { year: 2024, unifamiliale: 562000, condo: 295000, plex: null },
    { year: 2025, unifamiliale: 570000, condo: 300000, plex: null },
    { year: 2026, unifamiliale: 575000, condo: 305000, plex: null },
  ],
  "gatineau-secteur": [
    { year: 2020, unifamiliale: 438000, condo: 235000, plex: null },
    { year: 2021, unifamiliale: 482000, condo: 255000, plex: null },
    { year: 2022, unifamiliale: 525000, condo: 275000, plex: null },
    { year: 2023, unifamiliale: 540000, condo: 285000, plex: null },
    { year: 2024, unifamiliale: 552000, condo: 292000, plex: null },
    { year: 2025, unifamiliale: 560000, condo: 296000, plex: null },
    { year: 2026, unifamiliale: 565000, condo: 300000, plex: null },
  ],
  "buckingham": [
    { year: 2020, unifamiliale: 355000, condo: 205000, plex: null },
    { year: 2021, unifamiliale: 390000, condo: 222000, plex: null },
    { year: 2022, unifamiliale: 425000, condo: 242000, plex: null },
    { year: 2023, unifamiliale: 440000, condo: 250000, plex: null },
    { year: 2024, unifamiliale: 452000, condo: 258000, plex: null },
    { year: 2025, unifamiliale: 460000, condo: 262000, plex: null },
    { year: 2026, unifamiliale: 465000, condo: 265000, plex: null },
  ],
};

export function getPriceHistory(slug: string): YearData[] | null {
  return priceHistory[slug] ?? null;
}

// ─── Formatage ─────────────────────────────────────────────────────────────
function formatPrice(v: number): string {
  if (v >= 1000000) return `${(v / 1000000).toFixed(2).replace(".", ",")} M$`;
  return `${Math.round(v / 1000)} k$`;
}
function formatPriceFull(v: number): string {
  return v.toLocaleString("fr-CA") + " $";
}

// ─── Types de lignes ────────────────────────────────────────────────────────
type LineKey = "unifamiliale" | "condo" | "plex";
const LINE_CONFIG: { key: LineKey; label: string; color: string }[] = [
  { key: "unifamiliale", label: "Unifamiliale", color: "var(--green)" },
  { key: "condo", label: "Condo", color: "var(--blue-text)" },
  { key: "plex", label: "Plex", color: "var(--amber-text)" },
];

// ─── Composant SVG Chart ────────────────────────────────────────────────────
export function PriceHistoryChart({ slug, nom }: { slug: string; nom: string }) {
  const data = priceHistory[slug];
  if (!data) return null;

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; yearIdx: number } | null>(null);

  // Responsive width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // Determine which lines have data
  const activeLines = LINE_CONFIG.filter((lc) =>
    data.some((d) => d[lc.key] !== null)
  );

  // Compute min/max across all active lines
  const allValues = activeLines.flatMap((lc) =>
    data.map((d) => d[lc.key]).filter((v): v is number => v !== null)
  );
  const dataMin = Math.min(...allValues);
  const dataMax = Math.max(...allValues);
  const range = dataMax - dataMin || 1;
  const yMin = dataMin - range * 0.1;
  const yMax = dataMax + range * 0.1;

  // Chart dimensions
  const height = 220;
  const padL = 62;
  const padR = 16;
  const padT = 16;
  const padB = 32;
  const chartW = Math.max(width - padL - padR, 0);
  const chartH = height - padT - padB;

  const years = data.map((d) => d.year);

  const toX = useCallback(
    (i: number) => padL + (chartW > 0 ? (i / (years.length - 1)) * chartW : 0),
    [chartW, years.length]
  );
  const toY = useCallback(
    (v: number) => padT + chartH - ((v - yMin) / (yMax - yMin)) * chartH,
    [chartH, yMin, yMax]
  );

  // Build polyline paths per line
  const paths = activeLines.map((lc) => {
    const pts: string[] = [];
    data.forEach((d, i) => {
      const v = d[lc.key];
      if (v !== null) pts.push(`${toX(i).toFixed(1)},${toY(v).toFixed(1)}`);
    });
    return { ...lc, d: `M${pts.join("L")}` };
  });

  // Y-axis ticks
  const tickCount = 5;
  const yTicks = Array.from({ length: tickCount }, (_, i) => {
    const v = yMin + ((yMax - yMin) * i) / (tickCount - 1);
    return { v, y: toY(v) };
  });

  // Hover handler
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (chartW <= 0) return;
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      // Find nearest year index
      let closest = 0;
      let minDist = Infinity;
      for (let i = 0; i < years.length; i++) {
        const dist = Math.abs(mx - toX(i));
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      }
      setTooltip({ x: toX(closest), y: e.clientY - rect.top, yearIdx: closest });
    },
    [chartW, years.length, toX]
  );

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  // Touch support for mobile
  const handleTouchMove = useCallback(
    (e: React.TouchEvent<SVGSVGElement>) => {
      if (chartW <= 0) return;
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const touch = e.touches[0];
      const mx = touch.clientX - rect.left;
      let closest = 0;
      let minDist = Infinity;
      for (let i = 0; i < years.length; i++) {
        const dist = Math.abs(mx - toX(i));
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      }
      setTooltip({ x: toX(closest), y: touch.clientY - rect.top, yearIdx: closest });
    },
    [chartW, years.length, toX]
  );
  const handleTouchEnd = useCallback(() => setTooltip(null), []);

  if (width === 0) {
    return <div ref={containerRef} style={{ width: "100%", height }} />;
  }

  return (
    <div ref={containerRef} className="dm-chart-container">
      <div className="dm-chart-title-row">
        <span className="dm-chart-title">Évolution des prix — {nom}</span>
        <div className="dm-chart-legend">
          {activeLines.map((lc) => (
            <span key={lc.key} className="dm-chart-legend-item">
              <span className="dm-chart-legend-dot" style={{ background: lc.color }} />
              {lc.label}
            </span>
          ))}
        </div>
      </div>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ display: "block", cursor: "crosshair", touchAction: "pan-y" }}
      >
        {/* Gridlines */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line
              x1={padL}
              x2={width - padR}
              y1={t.y}
              y2={t.y}
              stroke="var(--border)"
              strokeWidth={0.5}
            />
            <text
              x={padL - 8}
              y={t.y + 3.5}
              textAnchor="end"
              fill="var(--text-tertiary)"
              fontSize={10}
              fontFamily="inherit"
            >
              {formatPrice(t.v)}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {years.map((yr, i) => (
          <text
            key={yr}
            x={toX(i)}
            y={height - 6}
            textAnchor="middle"
            fill="var(--text-tertiary)"
            fontSize={10}
            fontFamily="inherit"
          >
            {yr}
          </text>
        ))}

        {/* Lines */}
        {paths.map((p) => (
          <path
            key={p.key}
            d={p.d}
            fill="none"
            stroke={p.color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {/* Data points */}
        {activeLines.map((lc) =>
          data.map((d, i) => {
            const v = d[lc.key];
            if (v === null) return null;
            return (
              <circle
                key={`${lc.key}-${i}`}
                cx={toX(i)}
                cy={toY(v)}
                r={3}
                fill="var(--bg-card)"
                stroke={lc.color}
                strokeWidth={1.5}
              />
            );
          })
        )}

        {/* Hover vertical line */}
        {tooltip && (
          <line
            x1={tooltip.x}
            x2={tooltip.x}
            y1={padT}
            y2={padT + chartH}
            stroke="var(--text-tertiary)"
            strokeWidth={0.5}
            strokeDasharray="3 3"
          />
        )}

        {/* Hover highlight dots */}
        {tooltip &&
          activeLines.map((lc) => {
            const v = data[tooltip.yearIdx][lc.key];
            if (v === null) return null;
            return (
              <circle
                key={`hover-${lc.key}`}
                cx={tooltip.x}
                cy={toY(v)}
                r={5}
                fill={lc.color}
                stroke="var(--bg-card)"
                strokeWidth={2}
              />
            );
          })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="dm-chart-tooltip"
          style={{
            left: Math.max(0, Math.min(tooltip.x, width - 16)),
            transform: tooltip.x > width / 2 ? "translateX(calc(-100% - 12px))" : "translateX(12px)",
          }}
        >
          <div className="dm-chart-tooltip-year">{data[tooltip.yearIdx].year}</div>
          {activeLines.map((lc) => {
            const v = data[tooltip.yearIdx][lc.key];
            if (v === null) return null;
            return (
              <div key={lc.key} className="dm-chart-tooltip-row">
                <span className="dm-chart-legend-dot" style={{ background: lc.color }} />
                <span className="dm-chart-tooltip-label">{lc.label}</span>
                <span className="dm-chart-tooltip-val">{formatPriceFull(v)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
