FROM marcaureln/volta AS development-dependencies-env
ENV NODE_ENV=production
COPY . ./.yarnrc.yml ./.pnp.* /app
WORKDIR /app
# install and use yarn 4.x
RUN yarn install --immutable && \
    yarn build

FROM marcaureln/volta AS production-env
ENV NODE_ENV=production
COPY ./package.json yarn.lock ./.yarnrc.yml /app/
COPY --from=development-dependencies-env /app/build /app/build
COPY --from=development-dependencies-env /app/.pnp* /app
COPY --from=development-dependencies-env /app/.yarn /app/.yarn
WORKDIR /app
## install and use yarn 4.x
CMD ["yarn", "start"]
