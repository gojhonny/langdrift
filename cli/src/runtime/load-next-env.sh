# Load tracked .env.development, then ignored .env, without overriding the
# current process environment (CI, Docker, Vercel).
# Source from an app directory. POSIX sh.

drift_load_env_file() {
  file=$1
  [ -f "$file" ] || return 0
  while IFS= read -r line || [ -n "$line" ]; do
    case "$line" in
    '' | \#*) continue ;;
    esac
    key=${line%%=*}
    eval "is_set=\${$key+x}"
    [ -n "$is_set" ] && continue
    export "$line"
  done < "$file"
}

drift_load_env_file .env.development
drift_load_env_file .env
