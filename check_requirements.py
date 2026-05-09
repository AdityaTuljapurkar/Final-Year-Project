import pkg_resources

requirements_file = "requirements.txt"

with open(requirements_file) as f:
    requirements = [line.strip() for line in f if line.strip() and not line.startswith("#")]

installed = {pkg.key: pkg.version for pkg in pkg_resources.working_set}

print("\nChecking installed packages...\n")

for req in requirements:
    pkg_name = req.split("==")[0].lower()

    if pkg_name in installed:
        print(f"✓ {pkg_name} is installed (version {installed[pkg_name]})")
    else:
        print(f"✗ {pkg_name} is NOT installed")

print("\nCheck")