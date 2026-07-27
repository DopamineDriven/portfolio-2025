#!/usr/bin/env bash
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
log() {
    echo -e "${GREEN}→${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Function to discover all packages in the monorepo
discover_packages() {
    local package_dirs=()

    # Find all package.json files, excluding node_modules and hidden directories
    while IFS= read -r package_json; do
        # Get the directory containing the package.json
        local dir=$(dirname "$package_json")
        package_dirs+=("$dir")
    done < <(find . -type f -name "package.json" \
        -not -path "*/node_modules/*" \
        -not -path "*/.git/*" \
        -not -path "./package.json" \
        | sort)

    printf '%s\n' "${package_dirs[@]}"
}

# Function to get package name from package.json
get_package_name() {
    local dir="$1"
    if [[ -f "$dir/package.json" ]]; then
        # Extract package name using jq if available, otherwise use sed
        if command -v jq &> /dev/null; then
            jq -r '.name // empty' "$dir/package.json" 2>/dev/null || echo ""
        else
            sed -n 's/.*"name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$dir/package.json" | head -1
        fi
    fi
}

# Function to clean a specific directory
clean_directory() {
    local dir="$1"
    local package_name="$2"

    if [[ -n "$package_name" ]]; then
        log "Cleaning $package_name in $dir"
    else
        log "Cleaning $dir"
    fi

    # Determine what to clean based on directory structure
    local clean_items=()

    # Always clean these if they exist
    [[ -d "$dir/node_modules" ]] && clean_items+=("node_modules")
    [[ -d "$dir/.turbo" ]] && clean_items+=(".turbo")

    # Clean build outputs based on directory type
    if [[ "$dir" == *"/apps/"* ]]; then
        # Apps might have .next for Next.js
        [[ -d "$dir/.next" ]] && clean_items+=(".next")
        [[ -d "$dir/dist" ]] && clean_items+=("dist")
    elif [[ "$dir" == *"/packages/"* ]]; then
        # Packages typically have dist
        [[ -d "$dir/dist" ]] && clean_items+=("dist")
    elif [[ "$dir" == *"/tooling/"* ]]; then
        # Tooling might only have .turbo and node_modules
        true
    fi

    # Clean the items
    if [[ ${#clean_items[@]} -gt 0 ]]; then
        (
            cd "$dir"
            git clean -xdf "${clean_items[@]}" 2>/dev/null || {
                # Fallback to rm if git clean fails (e.g., not in git repo)
                for item in "${clean_items[@]}"; do
                    rm -rf "$item"
                done
            }
        )
    fi
}

# Function to clean entire house
clean_house() {
    log "Starting deep clean of monorepo..."

    # Discover all packages
    local packages=()
    while IFS= read -r package_dir; do
        packages+=("$package_dir")
    done < <(discover_packages)

    # Clean each package
    for package_dir in "${packages[@]}"; do
        local package_name=$(get_package_name "$package_dir")
        clean_directory "$package_dir" "$package_name"
    done

    # Clean root level
    log "Cleaning root directory"
    git clean -xdf node_modules pnpm-lock.yaml 2>/dev/null || {
        rm -rf node_modules pnpm-lock.yaml
    }

    # Reinstall dependencies
    log "Reinstalling dependencies with pnpm"
    pnpm install --no-frozen-lockfile

    # Run targeted build
    log "Running targeted build"
    build_targeted
}

# Function to build specific packages
build_targeted() {
    local build_order=(
        "@portfolio/eslint-config"
        "@portfolio/prettier-config"
        "@portfolio/vitest-config"
        "@portfolio/types"
        "@portfolio/ui"
        "@portfolio/chess-v2"
        "@portfolio/pong"
        "@portfolio/web"
    )

    for package in "${build_order[@]}"; do
        log "Building $package"
        pnpm turbo build --filter="$package"
    done
}

build_by_pattern() {
    local pattern="$1"
    log "Building packages matching pattern: $pattern"

    # Discover packages and filter by pattern
    while IFS= read -r package_dir; do
        local package_name=$(get_package_name "$package_dir")

        if [[ -n "$package_name" ]] && [[ "$package_name" == *"$pattern"* ]]; then
            log "Building $package_name"
            pnpm turbo build --filter="$package_name"
        fi
    done < <(discover_packages)
}

run_by_pattern() {
    local pattern="$1"
    log "running packages matching pattern: $pattern"

    # Discover packages and filter by pattern
    while IFS= read -r package_dir; do
        local package_name=$(get_package_name "$package_dir")

        if [[ -n "$package_name" ]] && [[ "$package_name" == *"$pattern"* ]]; then
            log "spinning up $package_name"
            pnpm turbo dev --filter="$package_name"
        fi
    done < <(discover_packages)
}


list_packages() {
    log "Discovering packages in monorepo:"
    echo ""

    local tooling_packages=()
    local app_packages=()
    local lib_packages=()

    while IFS= read -r package_dir; do
        local package_name=$(get_package_name "$package_dir")
        local relative_dir="${package_dir#./}"

        if [[ -n "$package_name" ]]; then
            local entry="  ${package_name} (${relative_dir})"
        else
            local entry="  [unnamed] (${relative_dir})"
        fi

        # Categorize packages
        if [[ "$package_dir" == *"/tooling/"* ]]; then
            tooling_packages+=("$entry")
        elif [[ "$package_dir" == *"/apps/"* ]]; then
            app_packages+=("$entry")
        elif [[ "$package_dir" == *"/packages/"* ]]; then
            lib_packages+=("$entry")
        else
            lib_packages+=("$entry")
        fi
    done < <(discover_packages)

    # Print categorized output
    if [[ ${#tooling_packages[@]} -gt 0 ]]; then
        echo "Tooling:"
        printf '%s\n' "${tooling_packages[@]}"
        echo ""
    fi

    if [[ ${#lib_packages[@]} -gt 0 ]]; then
        echo "Packages:"
        printf '%s\n' "${lib_packages[@]}"
        echo ""
    fi

    if [[ ${#app_packages[@]} -gt 0 ]]; then
        echo "Apps:"
        printf '%s\n' "${app_packages[@]}"
        echo ""
    fi
}

clean_by_pattern() {
    local pattern="$1"
    log "Cleaning packages matching pattern: $pattern"

    while IFS= read -r package_dir; do
        local package_name=$(get_package_name "$package_dir")

        if [[ -n "$package_name" ]] && [[ "$package_name" == *"$pattern"* ]]; then
            clean_directory "$package_dir" "$package_name"
        fi
    done < <(discover_packages)
}

# Main script logic
main() {
    local command="${1:-help}"

    case "$command" in
        clean:house)
            clean_house
            ;;
        build:targeted)
            build_targeted
            ;;
        clean|--clean|-c)
            if [[ -n "${2:-}" ]]; then
                clean_by_pattern "$2"
            else
                error "Please provide a pattern to clean (e.g., ./manage.sh clean ui)"
                exit 1
            fi
            ;;
        build|--build|-b)
            if [[ -n "${2:-}" ]]; then
                build_by_pattern "$2"
            else
                error "Please provide a pattern to build (e.g., ./manage.sh build encryption)"
                exit 1
            fi
            ;;
        run|--run|-r)
            if [[ -n "${2:-}" ]]; then
                run_by_pattern "$2"
            else
                error "Please provide a pattern to run (e.g., ./manage.sh run ws-server)"
                exit 1
            fi
            ;;
        list)
            list_packages
            ;;
        help|--help|-h)
            cat << EOF
Monorepo Package Management Script

Usage: $0 [command] [options]

Commands:
    clean:house         Deep clean entire monorepo and rebuild
    build:targeted      Build targeted packages in order
    clean <pattern>     Clean packages matching pattern
    build <pattern>     Build packages matching pattern
    list               List all discovered packages
    help               Show this help message

Examples:
    $0 clean:house              # Full clean and rebuild
    $0 build:targeted           # Build core packages
    $0 clean ui                 # Clean packages with 'ui' in name
    $0 build encryption         # Build packages with 'encryption' in name
    $0 list                     # Show all packages

Environment:
    Set DEBUG=1 for verbose output

EOF
            ;;
        *)
            error "Unknown command: $command"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
