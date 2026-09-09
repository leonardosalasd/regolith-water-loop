FROM python:3.12-slim AS runtime

WORKDIR /work

COPY pyproject.toml README.md ./
COPY src ./src
RUN pip install --no-cache-dir .

ENTRYPOINT ["rwl"]
CMD ["--help"]
