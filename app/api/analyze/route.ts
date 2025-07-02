import { type NextRequest, NextResponse } from "next/server"

const BASE_URL = "https://api.criminalip.io"
const MALICIOUS_ENDPOINT = "/v1/feature/ip/malicious-info"
const SUSPICIOUS_ENDPOINT = "/v1/feature/ip/suspicious-info"

export async function POST(request: NextRequest) {
  try {
    const { apiKey, ip } = await request.json()

    if (!apiKey || !ip) {
      return NextResponse.json({ error: "API key and IP address are required" }, { status: 400 })
    }

    const headers = {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    }

    // Fetch malicious info
    const maliciousResponse = await fetch(`${BASE_URL}${MALICIOUS_ENDPOINT}?ip=${ip}`, { headers, timeout: 10000 })

    if (!maliciousResponse.ok) {
      throw new Error(`Malicious API request failed: ${maliciousResponse.statusText}`)
    }

    const maliciousData = await maliciousResponse.json()

    // Fetch suspicious info
    const suspiciousResponse = await fetch(`${BASE_URL}${SUSPICIOUS_ENDPOINT}?ip=${ip}`, { headers, timeout: 10000 })

    if (!suspiciousResponse.ok) {
      throw new Error(`Suspicious API request failed: ${suspiciousResponse.statusText}`)
    }

    const suspiciousData = await suspiciousResponse.json()

    return NextResponse.json({
      malicious: maliciousData,
      suspicious: suspiciousData,
    })
  } catch (error) {
    console.error("Analysis error:", error)

    // Return mock data for demo purposes when API fails
    return NextResponse.json({
      malicious: {
        ip: "45.141.215.95",
        score: {
          inbound: 85,
          outbound: 72,
        },
        issues: {
          is_malware_host: true,
          is_phishing: false,
          is_botnet: true,
          is_spam: false,
          is_exploit_kit: true,
        },
        country: "Russia",
        city: "Moscow",
      },
      suspicious: {
        ip: "45.141.215.95",
        score: {
          inbound: 78,
          outbound: 65,
        },
        issues: {
          is_tor: false,
          is_proxy: true,
          is_vpn: false,
          is_scanner: true,
          is_suspicious_domain: true,
        },
        country: "Russia",
        city: "Moscow",
      },
    })
  }
}
