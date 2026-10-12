FROM python:3.12-slim AS runtime

WORKDIR /work

# The image is built without .git, so hatch-vcs cannot read the tag
ARG RWL_VERSION=0.0.0
ENV SETUPTOOLS_SCM_PRETEND_VERSION=${RWL_VERSION}

COPY pyproject.toml README.md LICENSE ./
COPY src ./src
RUN pip install --no-cache-dir .

ENTRYPOINT ["rwl"]
CMD ["--help"]
