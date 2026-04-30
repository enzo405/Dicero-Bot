/* 
______________________________________________________________________________________________________________
|               |                  |                                      |                                   |
| Style	        | Discord format   | Output (12-hour clock)               | Output (24-hour clock)            |
|_______________|__________________|______________________________________|___________________________________|
| Default	    | <t:1543392060>   | November 28, 2018 9:01 AM	          | 28 November 2018 09:01            |
|_______________|__________________|______________________________________|___________________________________|
| ShortTime	    | <t:1543392060:t> | 9:01 AM	                          | 09:01                             |
|_______________|__________________|______________________________________|___________________________________|
| LongTime	    | <t:1543392060:T> | 9:01:00 AM                           | 09:01:00                          |
|_______________|__________________|______________________________________|___________________________________|
| ShortDate	    | <t:1543392060:d> | 11/28/2018                           | 28/11/2018                        |
|_______________|__________________|______________________________________|___________________________________|
| LongDate	    | <t:1543392060:D> | November 28, 2018	                  | 28 November 2018                  |
|_______________|__________________|______________________________________|___________________________________|
| ShortDateTime | <t:1543392060:f> | November 28, 2018 9:01 AM	          | 28 November 2018 09:01            |
|_______________|__________________|______________________________________|___________________________________|
| LongDateTime  | <t:1543392060:F> | Wednesday, November 28, 2018 9:01 AM |	Wednesday, 28 November 2018 09:01 |
|_______________|__________________|______________________________________|___________________________________|
| RelativeTime  | <t:1543392060:R> | 3 years ago	                      | 3 years ago                       |
|_______________|__________________|______________________________________|___________________________________|
*/

export const DiscordTimeFormat = {
	/**
	 * 12 Hour Clock: November 28, 2018 9:01 AM
	 *
	 * 24 Hour Clock: 28 November 2018 09:01
	 */
	Default: (time: number): string => `<t:${time}>`,

	/**
	 * 12 Hour Clock: November 28, 2018
	 *
	 * 24 Hour Clock: 28 November 2018
	 */
	LongDate: (time: number): string => `<t:${time}:D>`,

	/**
	 * 12 Hour Clock: Wednesday, November 28, 2018 9:01 AM
	 *
	 * 24 Hour Clock: Wednesday, 28 November 2018 09:01
	 */
	LongDateTime: (time: number): string => `<t:${time}:F>`,

	/**
	 * 12 Hour Clock: 9:01:00 AM
	 *
	 * 24 Hour Clock: 09:01:00
	 */
	LongTime: (time: number): string => `<t:${time}:T>`,

	/**
	 * The Discord relative time updates every second.
	 *
	 * 12 Hour Clock: 3 years ago
	 *
	 * 24 Hour Clock: 3 years ago
	 */
	RelativeTime: (time: number): string => `<t:${time}:R>`,

	/**
	 * 12 Hour Clock: 11/28/2018
	 *
	 * 24 Hour Clock: 28/11/2018
	 */
	ShortDate: (time: number): string => `<t:${time}:d>`,

	/**
	 * 12 Hour Clock: November 28, 2018 9:01 AM
	 *
	 * 24 Hour Clock: 28 November 2018 09:01
	 */
	ShortDateTime: (time: number): string => `<t:${time}:f>`,

	/**
	 * 12 Hour Clock: 9:01 AM
	 *
	 * 24 Hour Clock: 09:01
	 */
	ShortTime: (time: number): string => `<t:${time}:t>`,
}
