<?php
/**
 * @copyright 2019 Wayfair LLC - All rights reserved
 */

namespace Wayfair\Migrations;

use Wayfair\Core\Contracts\ConfigHelperContract;
use Wayfair\Repositories\KeyValueRepository;

/**
 * Set default item mapping method to Variation Number ('numberExact').
 * Class CreateDefaultItemMapping
 *
 * @package Wayfair\Migrations
 */
class CreateDefaultItemMapping {
  /**
   * @var KeyValueRepository
   */
  private $keyValueRepository;

  /**
   * CreateDefaultItemMapping constructor.
   *
   * @param KeyValueRepository $keyValueRepository
   */
  public function __construct(KeyValueRepository $keyValueRepository) {
    $this->keyValueRepository = $keyValueRepository;
  }

  /**
   *
   * @throws \Plenty\Exceptions\ValidationException
   * @return void
   */
  public function run() {
    if (empty($this->keyValueRepository->get(ConfigHelperContract::SETTINGS_DEFAULT_ITEM_MAPPING_METHOD))) {
      $this->keyValueRepository->putOrReplace(ConfigHelperContract::SETTINGS_DEFAULT_ITEM_MAPPING_METHOD, ConfigHelperContract::ITEM_MAPPING_VARIATION_NUMBER);
    }
  }

}
