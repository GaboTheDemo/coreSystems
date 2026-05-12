// src/components/CategoryDropdown/CategoryDropdown.tsx
import React from 'react';
import { type CategoryDropdownData } from '../../types';
import styles from './CategoryDropdown.module.css';

interface CategoryDropdownProps {
  category: CategoryDropdownData;
  onItemClick?: (item: string) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ category, onItemClick }) => {
  const { sections } = category;

  return (
    <div className={styles.dropdown}>
      {/* Main Section */}
      <div className={styles.column}>
        <div className={styles.columnHeader}>
          <span className={styles.columnIcon}>
            {getCategoryIcon(category.icon)}
          </span>
          <h3 className={styles.columnTitle}>{sections.main.title}</h3>
        </div>
        <div className={styles.divider} />
        {sections.main.filters.map((filter) => (
          <div key={filter.label} className={styles.filterGroup}>
            <p className={styles.filterLabel}>{filter.label}</p>
            <p className={styles.filterItems}>
              {filter.items.map((item, i) => (
                <React.Fragment key={item}>
                  <span
                    className={styles.filterItem}
                    onClick={() => onItemClick?.(item)}
                  >
                    {item}
                  </span>
                  {i < filter.items.length - 1 && (
                    <span className={styles.separator}> | </span>
                  )}
                </React.Fragment>
              ))}
            </p>
          </div>
        ))}
      </div>

      {/* Accessories Section */}
      <div className={styles.column}>
        <div className={styles.columnHeader}>
          <span className={styles.columnIcon}>🖥️</span>
          <h3 className={styles.columnTitle}>{sections.accessories.title}</h3>
        </div>
        <div className={styles.divider} />
        {sections.accessories.items.map((acc) => (
          <div key={acc.label} className={styles.filterGroup}>
            <p className={styles.filterLabel}>{acc.label}</p>
            {acc.items.map((item) => (
              <p
                key={item}
                className={styles.accItem}
                onClick={() => onItemClick?.(item)}
              >
                {item}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* More Section */}
      <div className={styles.column}>
        <div className={styles.columnHeader}>
          <span className={styles.columnIcon}>🔍</span>
          <h3 className={styles.columnTitle}>{sections.more.title}</h3>
        </div>
        <div className={styles.divider} />
        <div className={styles.filterGroup}>
          <p className={styles.filterLabel}>{sections.more.label}</p>
          {sections.more.items.map((item) => (
            <p
              key={item}
              className={styles.accItem}
              onClick={() => onItemClick?.(item)}
            >
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

const getCategoryIcon = (icon: string): string => {
  const icons: Record<string, string> = {
    smartphone: '📱',
    laptop: '💻',
    tablet: '📲',
    gamepad: '🎮',
    tv: '📺',
    watch: '⌚',
    trending: '📈',
    tag: '🏷️',
  };
  return icons[icon] ?? '🔧';
};

export default CategoryDropdown;