# r_bayes_update.R --- Bayesian regime-conditional Sharpe update
#
# Called from the Python orchestrator via subprocess (or via reticulate).
# Returns a vector of posterior strategy weights given the prior weight vector
# and a window of regime-conditional daily PnL.
#
# Inputs (JSON on stdin):
#   {
#     "prior":    [ w_1, w_2, ..., w_11 ],     # length 11, sums to 1
#     "pnl_in_regime": {                        # per-strategy daily PnL vector
#       "macro_regime_fusion": [0.012, -0.004, ...],
#       ...
#     },
#     "risk_free_daily": 0.000156                 # daily T-bill yield
#   }
#
# Output (JSON on stdout):
#   {
#     "posterior": [ ... ],     # length 11, sums to 1
#     "n_obs":     int,           # length of the conditioning window
#     "shrinkage": float          # how much prior mass was preserved
#   }
#
# Author : Finn Lakin
# License: MIT

suppressMessages(library(jsonlite))

# ---- Read input ----------------------------------------------------------
inp <- fromJSON(file("stdin"), simplifyVector = FALSE)
prior   <- unlist(inp$prior)
pnl_lst <- inp$pnl_in_regime
rf      <- as.numeric(inp$risk_free_daily)

stopifnot(abs(sum(prior) - 1) < 1e-6)

strategy_names <- names(pnl_lst)
n_obs <- length(pnl_lst[[1]])

# ---- Sharpe per strategy (in-regime, annualised) -------------------------
ann <- sqrt(252)
sharpes <- sapply(strategy_names, function(name) {
  r <- unlist(pnl_lst[[name]]) - rf
  if (sd(r) < 1e-9) 0 else mean(r) / sd(r) * ann
})

# Clip extremes
sharpes <- pmin(pmax(sharpes, -1.0), 4.0)

# ---- Shrinkage controlled by sample size --------------------------------
# At n_obs = 60 we keep 30% prior mass (asymptotic floor).
# At n_obs =  0 we keep 70% prior mass.
shrinkage <- 0.70 - min(1.0, n_obs / 60) * 0.40

# ---- Posterior: blend prior with normalised exponential of Sharpe -------
emp <- exp(sharpes)
emp <- emp / sum(emp)              # normalise empirical posterior

posterior <- shrinkage * prior + (1 - shrinkage) * emp
posterior <- pmax(posterior, 0)
posterior <- posterior / sum(posterior)

# ---- Emit --------------------------------------------------------------
out <- list(
  posterior = as.list(round(posterior, 6)),
  n_obs     = n_obs,
  shrinkage = round(shrinkage, 4)
)
cat(toJSON(out, auto_unbox = TRUE, pretty = TRUE))
