"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

export interface CarbonPurchaseCertificateData {
  buyerName: string;
  projectName: string;
  projectId: string;
  location: string;
  projectArea: number | null;
  creditsPurchased: number;
  co2ePurchased: number;
  pricePerCredit: number;
  totalAmount: number;
  purchaseDate: string;
  transactionId: string;
  certificateId: string;
  paymentMethod: string;
}

const colors = {
  paper: "#F8F5ED",
  white: "#FFFFFF",
  ink: "#132A2E",
  muted: "#6E858A",
  primary: "#176F63",
  primaryDark: "#0E5A50",
  line: "#CFE0DC",
  soft: "#ECF5F2",
  softBlue: "#EFF6F7",
};

const styles = StyleSheet.create({
  page: {
    size: "A4",
    padding: 28,
    backgroundColor: colors.paper,
    color: colors.ink,
    fontFamily: "Helvetica",
  },

  outerFrame: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.primaryDark,
    padding: 14,
  },

  innerFrame: {
    flex: 1,
    borderWidth: 0.8,
    borderColor: "#8FC5BB",
    paddingHorizontal: 30,
    paddingTop: 18,
    paddingBottom: 14,
  },

  topRule: {
    height: 2.5,
    backgroundColor: colors.primary,
    width: "100%",
    marginBottom: 20,
  },

  brand: {
    alignItems: "center",
    flexShrink: 0,
  },

  brandName: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 2.8,
    color: colors.primary,
  },

  brandSubtitle: {
    marginTop: 4,
    fontSize: 7.5,
    letterSpacing: 1.25,
    color: colors.muted,
  },

  titleBlock: {
    alignItems: "center",
    marginTop: 28,
    flexShrink: 0,
  },

  titleLine1: {
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: 1,
    color: colors.ink,
    textAlign: "center",
  },

  titleLine2: {
    marginTop: 9,
    fontSize: 23,
    fontWeight: 700,
    letterSpacing: 0.8,
    color: colors.ink,
    textAlign: "center",
  },

  titleUnderline: {
    marginTop: 12,
    width: 92,
    height: 1.4,
    backgroundColor: colors.primary,
  },

  intro: {
    marginTop: 18,
    paddingHorizontal: 22,
    fontSize: 9.5,
    lineHeight: 1.55,
    color: "#40585D",
    textAlign: "center",
    flexShrink: 0,
  },

  buyerBox: {
    marginTop: 18,
    minHeight: 52,
    borderWidth: 0.8,
    borderColor: "#B8D9D2",
    backgroundColor: colors.soft,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    flexShrink: 0,
  },

  smallLabel: {
    fontSize: 7.5,
    letterSpacing: 1.7,
    color: colors.muted,
    textAlign: "center",
  },

  buyerName: {
    marginTop: 4,
    fontSize: 17,
    fontWeight: 700,
    color: colors.ink,
    textAlign: "center",
  },

  purchasedBlock: {
    marginTop: 10,
    alignItems: "center",
    flexShrink: 0,
  },

  hasPurchased: {
    fontSize: 9.5,
    color: "#40585D",
    textAlign: "center",
  },

  creditNumber: {
    marginTop: 1,
    fontSize: 28,
    fontWeight: 700,
    lineHeight: 1,
    color: colors.primary,
    textAlign: "center",
  },

  creditLabel: {
    marginTop: 2,
    fontSize: 7.8,
    letterSpacing: 0.7,
    color: colors.muted,
    textAlign: "center",
  },

  section: {
    marginTop: 14,
    flexShrink: 0,
  },

  sectionTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: 1.2,
    color: colors.primary,
    marginBottom: 7,
  },

  projectGrid: {
    flexDirection: "row",
    gap: 8,
  },

  projectColumn: {
    flex: 1,
    gap: 8,
  },

  detailCard: {
    minHeight: 48,
    borderWidth: 0.7,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: "center",
  },

  detailLabel: {
    fontSize: 6.8,
    letterSpacing: 1,
    color: colors.muted,
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 8.4,
    lineHeight: 1.25,
    fontWeight: 700,
    color: colors.ink,
  },

  purchaseTable: {
    borderWidth: 0.7,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  purchaseRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 15.5,
    borderBottomWidth: 0.45,
    borderBottomColor: "#E5EEEC",
  },

  purchaseRowLast: {
    borderBottomWidth: 0,
  },

  purchaseLabel: {
    flex: 1,
    fontSize: 7.2,
    color: colors.muted,
    paddingRight: 8,
  },

  purchaseValue: {
    width: 190,
    fontSize: 7.7,
    fontWeight: 700,
    color: colors.ink,
    textAlign: "right",
  },

  authorityBox: {
    marginTop: 11,
    borderWidth: 0.8,
    borderColor: "#9BC8BF",
    backgroundColor: colors.softBlue,
    paddingHorizontal: 12,
    paddingVertical: 9,
    alignItems: "center",
    flexShrink: 0,
  },

  authorityTitle: {
    fontSize: 8.6,
    fontWeight: 700,
    letterSpacing: 1,
    color: colors.primaryDark,
    textAlign: "center",
  },

  authorityText: {
    marginTop: 4,
    fontSize: 6.9,
    lineHeight: 1.4,
    color: "#567075",
    textAlign: "center",
  },

  footer: {
    marginTop: 10,
    flexShrink: 0,
  },

  footerLine: {
    height: 0.7,
    backgroundColor: "#B8D9D2",
    marginBottom: 7,
  },

  footerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 18,
  },

  registryBlock: {
    flex: 1,
  },

  registryLabel: {
    fontSize: 6.5,
    letterSpacing: 0.9,
    color: colors.muted,
  },

  registryValue: {
    marginTop: 3,
    fontSize: 6.8,
    fontWeight: 700,
    color: colors.primaryDark,
  },

  identifierBlock: {
    width: 245,
    alignItems: "flex-end",
  },

  identifierLabel: {
    fontSize: 6.5,
    letterSpacing: 0.9,
    color: colors.muted,
    textAlign: "right",
  },

  identifierValue: {
    marginTop: 3,
    fontSize: 6.8,
    fontWeight: 700,
    color: colors.ink,
    textAlign: "right",
  },

  footerNote: {
    marginTop: 6,
    fontSize: 5.9,
    lineHeight: 1.35,
    color: "#84989C",
    textAlign: "center",
  },
});

function formatNumber(value: number | null | undefined, decimals = 0) {
  return Number(value ?? 0).toLocaleString("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
}

function formatCurrency(value: number | null | undefined) {
  return `Rs. ${Number(value ?? 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function safeText(value: string | null | undefined, fallback = "Not available") {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export default function CarbonPurchaseCertificate({
  data,
}: {
  data: CarbonPurchaseCertificateData;
}) {
  return (
    <Document
      title={`Carbon Credit Purchase Certificate - ${data.certificateId}`}
      author="BlueCarbon Nexus"
      subject="Blue Carbon Credit Purchase Certificate"
    >
      <Page size="A4" style={styles.page} wrap={false}>
        <View style={styles.outerFrame}>
          <View style={styles.innerFrame}>
            <View style={styles.topRule} />

            <View style={styles.brand}>
              <Text style={styles.brandName}>BLUECARBON NEXUS</Text>
              <Text style={styles.brandSubtitle}>
                BLOCKCHAIN-BASED BLUE CARBON REGISTRY &amp; MRV
              </Text>
            </View>

            <View style={styles.titleBlock}>
              <Text style={styles.titleLine1}>CARBON CREDIT</Text>
              <Text style={styles.titleLine2}>PURCHASE CERTIFICATE</Text>
              <View style={styles.titleUnderline} />
            </View>

            <Text style={styles.intro}>
              This certificate records the purchase of verified blue carbon credits associated with an Authority-approved mangrove restoration project.
            </Text>

            <View style={styles.buyerBox}>
              <Text style={styles.smallLabel}>PURCHASED BY</Text>
              <Text style={styles.buyerName}>{safeText(data.buyerName)}</Text>
            </View>

            <View style={styles.purchasedBlock}>
              <Text style={styles.hasPurchased}>has purchased</Text>
              <Text style={styles.creditNumber}>
                {formatNumber(data.creditsPurchased)}
              </Text>
              <Text style={styles.creditLabel}>CARBON CREDITS / tCO2e</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PROJECT DETAILS</Text>

              <View style={styles.projectGrid}>
                <View style={styles.projectColumn}>
                  <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>PROJECT NAME</Text>
                    <Text style={styles.detailValue}>
                      {safeText(data.projectName)}
                    </Text>
                  </View>

                  <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>LOCATION</Text>
                    <Text style={styles.detailValue}>
                      {safeText(data.location)}
                    </Text>
                  </View>
                </View>

                <View style={styles.projectColumn}>
                  <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>PROJECT ID</Text>
                    <Text style={styles.detailValue} wrap>
                      {safeText(data.projectId)}
                    </Text>
                  </View>

                  <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>PROJECT AREA</Text>
                    <Text style={styles.detailValue}>
                      {data.projectArea !== null
                        ? `${formatNumber(data.projectArea, 4)} ha`
                        : "Not available"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PURCHASE DETAILS</Text>

              <View style={styles.purchaseTable}>
                <View style={styles.purchaseRow}>
                  <Text style={styles.purchaseLabel}>Credits Purchased</Text>
                  <Text style={styles.purchaseValue}>
                    {formatNumber(data.creditsPurchased)}
                  </Text>
                </View>

                <View style={styles.purchaseRow}>
                  <Text style={styles.purchaseLabel}>CO2e Represented</Text>
                  <Text style={styles.purchaseValue}>
                    {formatNumber(data.co2ePurchased, 2)} tCO2e
                  </Text>
                </View>

                <View style={styles.purchaseRow}>
                  <Text style={styles.purchaseLabel}>Price Per Credit</Text>
                  <Text style={styles.purchaseValue}>
                    {formatCurrency(data.pricePerCredit)}
                  </Text>
                </View>

                <View style={styles.purchaseRow}>
                  <Text style={styles.purchaseLabel}>Total Amount</Text>
                  <Text style={styles.purchaseValue}>
                    {formatCurrency(data.totalAmount)}
                  </Text>
                </View>

                <View style={styles.purchaseRow}>
                  <Text style={styles.purchaseLabel}>Payment Method</Text>
                  <Text style={styles.purchaseValue}>
                    {safeText(data.paymentMethod)}
                  </Text>
                </View>

                <View style={styles.purchaseRow}>
                  <Text style={styles.purchaseLabel}>Purchase Date</Text>
                  <Text style={styles.purchaseValue}>
                    {formatDate(data.purchaseDate)}
                  </Text>
                </View>

                <View style={styles.purchaseRow}>
                  <Text style={styles.purchaseLabel}>Transaction ID</Text>
                  <Text style={styles.purchaseValue} wrap>
                    {safeText(data.transactionId)}
                  </Text>
                </View>

                <View style={[styles.purchaseRow, styles.purchaseRowLast]}>
                  <Text style={styles.purchaseLabel}>Certificate ID</Text>
                  <Text style={styles.purchaseValue} wrap>
                    {safeText(data.certificateId)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.authorityBox}>
              <Text style={styles.authorityTitle}>AUTHORITY APPROVED PROJECT</Text>
              <Text style={styles.authorityText}>
                The purchased credits are linked to the project identified above and recorded in the BlueCarbon Nexus registry.
              </Text>
            </View>

            <View style={styles.footer}>
              <View style={styles.footerLine} />

              <View style={styles.footerRow}>
                <View style={styles.registryBlock}>
                  <Text style={styles.registryLabel}>BLUECARBON NEXUS REGISTRY</Text>
                  <Text style={styles.registryValue}>Verified Purchase Record</Text>
                </View>

                <View style={styles.identifierBlock}>
                  <Text style={styles.identifierLabel}>CERTIFICATE IDENTIFIER</Text>
                  <Text style={styles.identifierValue} wrap>
                    {safeText(data.certificateId)}
                  </Text>
                </View>
              </View>

              <Text style={styles.footerNote}>
                Generated from the BlueCarbon Nexus purchase registry. This document records the purchase transaction associated with the identified project.
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
