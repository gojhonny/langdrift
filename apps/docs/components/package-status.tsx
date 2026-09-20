import setupPackage from '../../../packages/core/package.json'
import sdkPackage from '../../../packages/sdk/package.json'

const packageMetadata = {
  sdk: { label: 'SDK', version: sdkPackage.version },
  setup: { label: 'Setup', version: setupPackage.version }
} as const

interface PackageStatusProps {
  package: keyof typeof packageMetadata
}

export function PackageStatus({ package: packageName }: PackageStatusProps) {
  const metadata = packageMetadata[packageName]

  return (
    <span className="ld-docs-package-status">
      {metadata.label} {metadata.version} · unpublished
    </span>
  )
}
