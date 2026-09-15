export type MarketStructure =
  | "Perfect Competition"
  | "Monopolistic Competition"
  | "Oligopoly"
  | "Monopoly";

export interface Market {
  name: string;

  structure: MarketStructure;

  /*
   * ========================================
   * MARKET DEMAND
   * ========================================
   */

  baseDemand: number;

  priceElasticity: number;

  marketSize: number;

  averageMarketPrice: number;

  /*
   * ========================================
   * MARKET STRUCTURE
   * ========================================
   *
   * Tracks the number of firms currently
   * operating in the market.
   *
   * This is especially important for
   * Monopolistic Competition, where entry
   * and exit shift the demand facing the
   * individual firm.
   */

  numberOfFirms: number;

  /*
   * ========================================
   * ENTRY / EXIT PRESSURE
   * ========================================
   *
   * Used by Monopolistic Competition.
   *
   * Positive:
   * pressure for firms to enter.
   *
   * Negative:
   * pressure for firms to exit.
   */

  entryExitPressure: number;
  

    /*
   * ========================================
   * MOST RECENT ENTRY / EXIT EVENT
   * ========================================
   *
   * Records whether firms entered or exited
   * when the previous quarter was processed.
   *
   * This allows the UI to explain why the
   * number of firms changed.
   */

  firmsEntered: number;

  firmsExited: number;


  /*
   * ========================================
   * OLIGOPOLY RIVAL STATE
   * ========================================
   *
   * Unlike Monopolistic Competition,
   * Oligopoly contains only a few major
   * competitors whose individual actions
   * matter.
   */

  /*
   * Current representative rival price.
   *
   * This will eventually change in response
   * to the player's pricing decisions.
   */
  rivalPrice: number;

  /*
   * Rival price from the previous quarter.
   *
   * This lets the game determine whether
   * competitors recently raised, lowered,
   * or maintained their prices.
   */
  previousRivalPrice: number;

  /*
   * PRICE WAR PRESSURE
   *
   * Measures escalating aggressive price
   * competition.
   *
   * 0 = stable competition
   *
   * Higher values = increasing danger that
   * rivals aggressively cut prices.
   */
  priceWarPressure: number;
  /*
 * ========================================
 * MOST RECENT RIVAL REACTION
 * ========================================
 *
 * Records how competitors responded to the
 * player's pricing decision in the most
 * recently completed quarter.
 */
rivalReaction:
  | "Stable"
  | "Partial Match"
  | "Aggressive Match"
  | "Price War"
  | "Rival Price Increase";
}
