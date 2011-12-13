//===========================================
//  jQuery plugin - J+  System Adapter
//===========================================

(function ($) {
	
	/**
	 * Object  ��д��
	 * @type Function
	 */
	var o = window.Object,
		
		/**
		 * Object.prototype.hasOwnProperty ��д��
		 * @type Function
		 */
		hasOwnProperty = o.prototype.hasOwnProperty,
		
		apply = $.extend,
		
		emptyFn = $.noop,
		
		/**
		 * ��ʽ���ַ����õ�������ʽ��
		 * @type RegExp
		 */
		rFormat = /\{+?(\S*?)\}+/g,
		
		/**
		 * ƥ���һ���ַ���
		 * @type RegExp
		 */
		rFirstChar = /(\b[a-z])/g,
		
		/**
		 * ��ʾ�հ��ַ���
		 * @type RegExp
		 */
		rWhite = /%20/g,
		
		/**
	     * תΪ���ո�ʽ��������ʽ��
	     * @type RegExp
	     */
		rToCamelCase = /-(\w)/g,
		
		/**
		 * ���������¼����͵Ĺ��ߡ�
		 * @type Object
		 */
		eventMgr = {
			
			/**
			 * ����Ĭ�ϵ����¼���
			 * @type Object
			 */
			$default: {
				add: emptyFn,
				initEvent: emptyFn,
				remove: emptyFn
			}
			
		},

		/**
		 * Py��̬����
		 * @namespace JPlus
		 */
		p = namespace('JPlus.', {
			
			/**
			 * ��ȡ����һ��Ԫ�ص����ݡ�
			 * @param {Object} obj Ԫ�ء�
			 * @param {String} dataType ���͡�
			 * @return {Object} ֵ��
			 * ����������ڶ���������һ�� data �ֶΣ� ������һ�� data.dataType ���󷵻ء�
			 * ���ԭ�ȴ��� data.dataType, ��ֱ�ӷ��ء�
			 * @example
			 * <code>
			 * var obj = {};
			 * JPlus.data(obj, 'a').c = 2;
			 * trace(  JPlus.data(obj, 'a').c  ) // 2
			 * </code>
			 */
			data: function (obj, dataType) {
				
				
				// �������ȡ '$data'��
				var d = obj.$data || (obj.$data = {}) ;
				
				// �������ȡ dataType��
				return d[dataType] || (d[dataType] = {});
			},
		
			/**
			 * ������ڣ���ȡ����һ��Ԫ�ص����ݡ�
			 * @param {Object} obj Ԫ�ء�
			 * @param {String} dataType ���͡�
			 * @return {Object} ֵ��
			 * ����������ڶ���������һ�� data �ֶΣ� ������һ�� data.dataType ���󷵻ء�
			 * ���ԭ�ȴ��� data.dataType, ��ֱ�ӷ��ء�
			 * @example
			 * <code>
			 * var obj = {};
			 * if(JPlus.getData(obj, 'a')) // ������� a ���ԡ� 
			 *     trace(  JPlus.data(obj, 'a')  )
			 * </code>
			 */
			getData:function (obj, dataType) {
				
				
				// ��ȡ����'$data'��
				var d = obj.$data;
				return d && d[dataType];
			},
			
			/**
			 * ��������һ��Ԫ�ص����ݡ�
			 * @param {Object} obj Ԫ�ء�
			 * @param {String} dataType ���͡�
			 * @param {Object} data ���ݡ�
			 * @return data
			 * @example
			 * <code>
			 * var obj = {};
			 * JPlus.setData(obj, 'a', 5);    //     5
			 * </code>
			 */
			setData: function (obj, dataType, data) {
				
				
				// �����ñ�����
				return (obj.$data || (obj.$data = {}))[dataType] = data;
			},
			
			/**
			 * ����һ���ࡣ
			 * @param {Object/Function} [methods] ��Ա���캯����
			 * @return {Class} ���ɵ��ࡣ
			 * ����һ���࣬�൱�ڼ̳��� JPlus.Object������
			 * @see JPlus.Object.extend
			 * @example
			 * <code>
			 * var MyCls = Class({
			 * 
			 *    constructor: function (g, h) {
			 * 	      alert('���캯��' + g + h)
			 *    }	
			 * 
			 * });
			 * 
			 * 
			 * var c = new MyCls(4, ' g');
			 * </code>
			 */
			Class: function (members) {
					
				// �����࣬��ʵ���� �̳� Object ������һ���ࡣ
				return Object.extend(members);
			},
			
			/**
			 * ������Ļ��ࡣ
			 * @class JPlus.Object
			 */
			Object: Object,
			
			/**
			 * �ɴ��ڵ����޸Ĵ����ࡣ
			 * @param {Function/Class} constructor ���������ࡣ
			 * @return {Class} ���ɵ��ࡣ
			 */
			Native: function (constructor) {
				
				// �򵥿���  Object �ĳ�Ա����ӵ��������ԡ�
				// �� JavaScript�� һ�к���������Ϊ�࣬�ʴ˺������ڡ�
				// Object �ĳ�Աһ��Ե�ǰ�๹�캯��ԭ�͸�����
				return applyIf(constructor, Object);
			},
			
			using: emptyFn,
			
			/// #endif
	
			/**
			 * �������ֿռ䡣
			 * @param {String} name ���ֿռ䡣
			 * @param {Object} [obj] ֵ��
			 * <p>
			 * ���ֿռ�����Ŀ�б�ʾ��Դ�ķ��ϡ�
			 * </p>
			 * 
			 * <p>
			 * ����  system/dom/keys.js �ļ��� ���ֿռ��� System.Dom.Keys
			 * ���ֿռ��������ٱ�ʾ��Դ�� {@link using} ��  {@link imports} ���Ը����ƶ������ֿռ�������Ӧ�����ݡ�
			 * </p>
			 * 
			 * <p>
			 * namespace �����ж�����أ� ���ֻ��1������:
			 * <code>
			 * namespace("System.Dom.Keys"); 
			 * </code>
			 * ��ʾϵͳ�Ѿ�������������ֿռ����Դ�� using �� imports �����������Դ�����롣
			 * </p>
			 * 
			 * <p>
			 * namespace �����2�������� ��ʾ��ָ����λ�ô�������
			 * <code>
			 * namespace("A.B.C", 5); // ��� A = {B: {C: 5}}  
			 * </code>
			 * ���д����󸲸��� C ��ֵ������Ӱ�� A �� B�� 
			 * 
			 * <p>
			 * ���������ֿռ�����ַ��� . ��ϵͳ�Ჹ�� 'JPlus'
			 * </p> 
			 * 
			 * <p>
			 * ���������ֿռ�������ַ��� . ��ϵͳ���Ḳ�����ж��󣬶��Ǹ��Ƴ�Ա�����ڵĳ�Ա��
			 * </p> 
			 * 
			 * </p>
			 * 
			 * @example
			 * <code>
			 * namespace("System.Dom.Keys");  // ���� ����ȥ����   System.Dom.Keys
			 * 
			 * var A = {   B:  {b: 5},  C: {b: 5}    };
			 * namespace("A.B", {a: 6})  // A = { B: {a: 6}, C: {b: 5}  }
			 * 
			 * var A = {   B:  {b: 5},  C: {b: 5}    };
			 * namespace("A.C.", {a: 6})  // A = { B: {b: 5},  C: {a: 6, b: 5} }
			 * 
			 * namespace(".G", 4);    // JPlus.G = G  = 4
			 * </code>
			 */
			namespace: namespace,
	
			/**
			 * Ĭ�ϵ�ȫ�����ֿռ䡣
			 * @config {Object}
			 * @value window
			 */
			defaultNamespace: 'JPlus',
			
			/**
			 * ���������¼����͵Ĺ��ߡ�
			 * @property
			 * @type Object
			 * @private
			 * ��������¼���Ϣ�洢�����������ʹ�� xType -> name�Ľṹ��
			 */
			Events: eventMgr, 
			
			/**
			 * ��ʾһ���¼��ӿڡ�
			 * @interface
			 * @singleton
			 * JPlus.IEvent �ṩ���¼����ƵĻ����ӿڣ���ʵ������ӿڵ���궼���¼��Ĵ���������
			 * �ڵ���  {@link JPlus.Object.addEvents} ��ʱ�򣬽��Զ�ʵ������ӿڡ�
			 */
			IEvent: {
			
				/**
				 * ����һ�������ߡ�
				 * @param {String} type �������֡�
				 * @param {Function} listener ���ú�����
				 * @param {Object} bind=this listener ִ��ʱ��������
				 * @return Object this
				 * @example
				 * <code>
				 * elem.on('click', function (e) {
				 * 		return true;
				 * });
				 * </code>
				 */
				on: function (type, listener, bind) {
					
					
					// ��ȡ������     ���������������   ���¼�ֵ
					var me = this, d = p.data(me, 'event'), evt = d[type];
					
					// ���δ�󶨹�����¼���
					if (!evt) {
						
						// ֧���Զ��尲װ��
						d[type] = evt = function (e) {
							var listener = arguments.callee,
								handlers = listener.handlers.slice(0), 
								i = -1,
								len = handlers.length;
							
							// ѭ��ֱ�� return false�� 
							while (++i < len) 
								if (handlers[i][0].call(handlers[i][1], e) === false) 										
									return false;
							
							return true;
						};
						
						// ��ȡ�¼�������� 
						d = getMgr(me, type);
						
						// ��ǰ�¼���ȫ��������
						evt.handlers = [[d.initEvent, me]];
						
						// ����¼���
						d.add(me, type, evt);
						
					}
					
					// ��ӵ� handlers ��
					evt.handlers.push([listener, bind || me]);
						
					return me;
				},
				
				/**
				 * ɾ��һ����������
				 * @param {String} [type] �������֡�
				 * @param {Function} [listener] �ص�����
				 * @return Object this
				 * ע��: function () {} !== function () {}, ����ζ���������������:
				 * <code>
				 * elem.on('click', function () {});
				 * elem.un('click', function () {});
				 * </code>
				 * ��Ӧ�ðѺ�������������
				 * <code>
				 * var c =  function () {};
				 * elem.on('click', c);
				 * elem.un('click', c);
				 * </code>
				 * @example
				 * <code>
				 * elem.un('click', function (e) {
				 * 		return true;
				 * });
				 * </code>
				 */
				un: function (type, listener) {
					
					
					// ��ȡ������     ���������������   ���¼�ֵ
					var me = this, d = p.getData(me, 'event'), evt, handlers, i;
					if (d) {
						 if (evt = d[type]) {
						 	
						 	handlers = evt.handlers;
						 	
							if (listener) {
								
								// �������ϵľ����
								for(i = handlers.length - 1; i; i--) {
									if(handlers[i][0] === listener)	{
										handlers.splice(i, 1);
										break;
									}
								} 
								
							}
								
							// ����Ƿ��������������û����ɾ���ĺ�����
							if (!listener || handlers.length < 2) {
								
								// ɾ�����¼���������ȫ�����ã����������ݻ��ա�
								delete d[type];
								
								// �ڲ��¼������ɾ����
								getMgr(me, type).remove(me, type, evt);
							}
						}else if (!type) {
							for (evt in d) 
								me.un(evt);
						}
					}
					return me;
				},
				
				/**
				 * ����һ����������
				 * @param {String} type �������֡�
				 * @param {Object} [e] �¼�������
				 * @return Object this
				 * trigger ֻ���ֶ������󶨵��¼���
				 * @example
				 * <code>
				 * elem.trigger('click');
				 * </code>
				 */
				trigger: function (type, e) {
					
					// ��ȡ������     ���������������   ���¼�ֵ ��
					var me = this, evt = p.getData(me, 'event'), eMgr;
					
					// ִ���¼���
					return !evt || !(evt = evt[type]) || ((eMgr = getMgr(me, type)).trigger ? eMgr.trigger(me, type, evt, e) : evt(e) );
					
				},
				
				/**
				 * ����һ��ִֻ��һ�εļ����ߡ�
				 * @param {String} type �������֡�
				 * @param {Function} listener ���ú�����
				 * @param {Object} bind=this listener ִ��ʱ��������
				 * @return Object this
				 * @example
				 * <code>
				 * elem.one('click', function (e) {
				 * 		trace('a');  
				 * });
				 * 
				 * elem.trigger('click');   //  ���  a
				 * elem.trigger('click');   //  û����� 
				 * </code>
				 */
				one: function (type, listener, bind) {
					
					
					// one �������� on ,  ֻ���Զ�Ϊ listener ִ�� un ��
					return this.on(type, function () {
						
						// ɾ��������հ���
						this.un( type, arguments.callee);
						
						// Ȼ����á�
						return listener.apply(this, arguments);
					}, bind);
				}
				
				
			}
			
		});
	
	/// #endregion
		
	/// #region ȫ�ֺ���
	
	/**
	 * @namespace JPlus.Object
	 */
	apply(Object, {
	
		/**
		 * ��չ��ǰ��Ķ�̬������
		 * @param {Object} members ��Ա��
		 * @return this
		 * @seeAlso JPlus.Object.implementIf
		 * @example
		 * <code>
		 * Number.implement({
		 *   sin: function () {
		 * 	    return Math.sin(this);
		 *  }
		 * });
		 * 
		 * (1).sin();  //  Math.sin(1);
		 * </code>
		 */
		implement: function (members) {

			// ���Ƶ�ԭ�� ��
			o.extend(this.prototype, members);
	        
			return this;
		},
		
		/**
		 * ��������ڳ�Ա, ��չ��ǰ��Ķ�̬������
		 * @param {Object} members ��Ա��
		 * @return this
		 * @seeAlso JPlus.Object.implement
		 */
		implementIf: function (members) {
		
	
			applyIf(this.prototype, members);
			
			return this;
		},
		
		/**
		 * Ϊ��ǰ������¼���
		 * @param {Object} [evens] �����¼��� ������¡�
		 * @return this
		 * <p>
		 * ����һ������¼��ǰ��� xType ���Դ�ŵģ�ӵ����ͬ  xType ���ཫ����ͬ���¼���Ϊ�˱���û�� xType ���Ե�������¼���ͻ�� ����������Զ���ȫ  xType ���ԡ�
		 * </p>
		 * 
		 * <p>
		 * ���������ʵ���Զ����¼��Ĺؼ���
		 * </p>
		 * 
		 * <p>
		 * addEvents �����Ĳ�����һ���¼���Ϣ����ʽ��:  {click: { add: ..., remove: ..., initEvent: ..., trigger: ...} ��
		 * ���� click ��ʾ�¼�����һ�㽨���¼�����Сд�ġ�
		 * </p>
		 * 
		 * <p>
		 * һ���¼��ж����Ӧ���ֱ���: ��(add), ɾ��(remove), ����(trigger), ��ʼ���¼�����(initEvent)
		 * </p>
		 * 
		 * </p>
		 * ���û�ʹ��   o.on('�¼���', ����)  ʱ�� ϵͳ���ж�����¼��Ƿ��Ѿ��󶨹���
		 * ���֮ǰδ���¼�����ᴴ���µĺ��� evtTrigger��
		 * evtTrigger ������������ִ�� evtTrigger.handlers ��ĳ�Ա, �������һ������ִ�к󷵻� false�� ����ִֹ�У������� false�� ���򷵻� true��
		 * evtTrigger.handlers ��ʾ ��ǰ����¼�������ʵ�ʵ��õĺ��������顣 evtTrigger.handlers[0] ���¼��� initEvent ������
		 * Ȼ��ϵͳ����� add(o, '�¼���', evtTrigger)
		 * Ȼ��� evtTrigger ������ o.data.event['�¼���'] �С�
		 * ��� ֮ǰ�Ѿ���������¼����� evtTrigger �Ѵ��ڣ����贴����
		 * ��ʱϵͳֻ��� ���� �ŵ� evtTrigger.handlers ���ɡ�
		 * </p>
		 * 
		 * <p>
		 * Ҳ����˵���������¼����������� evtTrigger�� evtTriggerȥִ���û������һ���¼�ȫ��������
		 * </p>
		 * 
		 * <p>
		 * ���û�ʹ��  o.un('�¼���', ����)  ʱ�� ϵͳ���ҵ���Ӧ evtTrigger�� ����
		 * evtTrigger.handlers ɾ�� ������
		 * ���  evtTrigger.handlers �ǿ����飬 ��ʹ��
		 * remove(o, '�¼���', evtTrigger)  �Ƴ��¼���
		 * </p>
		 * 
		 * <p>
		 * ���û�ʹ��  o.trigger(����)  ʱ�� ϵͳ���ҵ���Ӧ evtTrigger�� 
		 * ����¼���trigger�� ��ʹ�� trigger(����, '�¼���', evtTrigger, ����) �����¼���
		 * ���û�У� ��ֱ�ӵ��� evtTrigger(����)��
		 * </p>
		 * 
		 * <p>
		 * ����ֱ���ܸ������ľ������ݡ�
		 * </p>
		 * 
		 * <p>
		 * add ��ʾ �¼�����ʱ�Ĳ�����  ԭ��Ϊ: 
		 * </p>
		 * 
		 * <code>
		 * function add(elem, type, fn) {
		 * 	   // ���ڱ�׼�� DOM �¼��� ������� elem.addEventListener(type, fn, false);
		 * }
		 * </code>
		 * 
		 * <p>
		 *  elem��ʾ���¼��Ķ��󣬼���ʵ���� type ���¼����ͣ� �������¼�������Ϊ����¼��� add ��������һ���ģ� ��� type �������¼����͵Ĺؼ���fn ���ǰ��¼��ĺ�����
		 * </p>
		 * 
		 * <p>
		 * remove ͬ��
		 * </p>
		 * 
		 * <p>
		 * initEvent �Ĳ�����һ���¼���������ֻ����1��������
		 * </p>
		 * 
		 * <p>
		 * trigger �Ǹ߼����¼����ο������˵���� 
		 * </p>
		 * 
		 * <p>
		 * ����㲻֪�����еļ����������ܣ��ر���  trigger ���벻Ҫ�Զ��塣
		 * </p>
		 * 
		 * @example
		 * ���������ʾ����θ�һ�����Զ����¼������������ʵ����Ȼ��󶨴�������¼���

		 * <code>
		 * 
		 * // ����һ���µ��ࡣ
		 * var MyCls = new Class();
		 * 
		 * MyCls.addEvents({
		 * 
		 *     click: {
		 * 			
		 * 			add:  function (elem, type, fn) {
		 * 	   			alert("Ϊ  elem �� �¼� " + type );
		 * 			},
		 * 
		 * 			initEvent: function (e) {
		 * 	   			alert("��ʼ�� �¼�����  " + e );
		 * 			}
		 * 
		 * 		}
		 * 
		 * });
		 * 
		 * var m = new MyCls;
		 * m.on('click', function () {
		 * 	  alert(' �¼� ���� ');
		 * });
		 * 
		 * m.trigger('click', 2);
		 * 
		 * </code>
		 */
		addEvents: function (events) {
			
			var ep = this.prototype;
			
			
			// ʵ�� �¼� �ӿڡ�
			applyIf(ep, p.IEvent);
			
			// ������Զ����¼�������ӡ�
			if (events) {
				
				var xType = hasOwnProperty.call(ep, 'xType') ? ep.xType : ( ep.xType = (p.id++).toString() );
				
				// �����¼�����
				o.update(events, function (e) {
					return applyIf(e, eventMgr.$default);
					
					// ��� JPlus.Events ���¼���
				}, eventMgr[xType] || (eventMgr[xType] = {}));
			
			}
			
			
			return this;	
		},
	
		/**
		 * �̳е�ǰ�ಢ�������ࡣ
		 * @param {Object/Function} [methods] ��Ա���캯����
		 * @return {Class} �̳е����ࡣ
		 * <p>
		 * ���������ʵ�ּ̳еĺ��ġ�
		 * </p>
		 * 
		 * <p>
		 * �� Javascript �У��̳�������ԭ����ʵ�ֵģ� ������������Ƕ����İ�װ����û��������Ķ�����
		 * </p>
		 * 
		 * <p>
		 * ��Ա�е�  constructor ��Ա ����Ϊ�ǹ��캯����
		 * </p>
		 * 
		 * <p>
		 * �������ʵ�ֵ��� ���̳С���������ж��幹�캯���������������Ĺ��캯����������ø���Ĺ��캯����
		 * </p>
		 * 
		 * <p>
		 * Ҫ��������Ĺ��캯�����ø���Ĺ��캯��������ʹ��  {@link JPlus.Object.prototype.base} ��
		 * </p>
		 * 
		 * <p>
		 * ����������ص���ʵ����һ��������������ʹ�� JPlus.Object ���ι���
		 * </p>
		 * 
		 * <p>
		 * ����ԭ�����Ĺ�ϵ�� ���ܴ��ڹ�������á�
		 * 
		 * ��: �� A ��  A.prototype.c = [];
		 * 
		 * ��ô��A��ʵ�� b , d ���� c ��Ա�� �����ǹ���һ��   A.prototype.c ��Ա��
		 * 
		 * ����Ȼ�ǲ���ȷ�ġ�������Ӧ�ð� ���� quick ��Ϊ false �� ������ A����ʵ����ʱ�򣬻��Զ������������ó�Ա��
		 * 
		 * ��Ȼ������һ���ȽϷ�ʱ�Ĳ�������ˣ�Ĭ��  quick �� true ��
		 * </p>
		 * 
		 * <p>
		 * ��Ҳ���԰Ѷ�̬��Ա�Ķ���ŵ� ���캯���� ��: this.c = [];
		 * 
		 * ������õĽ��������
		 * </p>
		 */
	 	extend: function (members) {
	
			// δָ������   ʹ��Ĭ�Ϲ��캯��(Object.prototype.constructor);
			
			// �������� ��
			var subClass = hasOwnProperty.call(members =  members instanceof Function ? {
					constructor: members
				} : (members || {}), "constructor") ? members.constructor : function () {
					
					// ���ø��๹�캯�� ��
					arguments.callee.base.apply(this, arguments);
					
				};
				
			// ������ ��
			emptyFn.prototype = (subClass.base = this).prototype;
			
			// ָ����Ա ��
			subClass.prototype = o.extend(new emptyFn, members);
			
			// ���ǹ��캯����
			subClass.prototype.constructor = subClass;

			// ָ��Class���� ��
			return p.Native(subClass);

		}

	});
	
	/**
	 * Object  ��д��
	 * @namespace Object
	 */
	apply(o, {

		/**
		 * ���ƶ�����������Ե��������� 
		 * @param {Object} dest ����Ŀ�ꡣ
		 * @param {Object} obj Ҫ���Ƶ����ݡ�
		 * @return {Object} ���ƺ�Ķ��� (dest)��
		 * @seeAlso Object.extendIf
		 * @example
		 * <code>
		 * var a = {v: 3}, b = {g: 2};
		 * Object.extend(a, b);
		 * trace(a); // {v: 3, g: 2}
		 * </code>
		 */
		extend: $.extend,

		/**
		 * ���Ŀ���Ա�����ھ͸��ƶ�����������Ե��������� 
		 * @param {Object} dest ����Ŀ�ꡣ
		 * @param {Object} obj Ҫ���Ƶ����ݡ�
		 * @return {Object} ���ƺ�Ķ��� (dest)��
		 * @seeAlso Object.extend
		 * <code>
		 * var a = {v: 3, g: 5}, b = {g: 2};
		 * Object.extendIf(a, b);
		 * trace(a); // {v: 3, g: 5}  b δ���� a �κγ�Ա��
		 * </code>
		 */
		extendIf: applyIf,
		
		/**
		 * ��һ���ɵ��������ϱ�����
		 * @param {Array/Object} iterable ���󣬲�֧�ֺ�����
		 * @param {Function} fn ��ÿ���������õĺ����� {@param {Object} value ��ǰ������ֵ} {@param {Number} key ��ǰ����������} {@param {Number} index ��ǰ����������} {@param {Array} array ���鱾��} {@return {Boolean} �����ֹѭ���� ���� false��}
	 	 * @param {Object} bind ����ִ��ʱ��������
		 * @return {Boolean} ����Ѿ�����������������ֵ�� ���� true�� ����������жϹ������� false��
		 * @example
		 * <code> 
		 * Object.each({a: '1', c: '3'}, function (value, key) {
		 * 		trace(key + ' : ' + value);
		 * });
		 * // ��� 'a : 1' 'c : 3'
		 * </code>
		 */
		each: function (iterable, fn, bind) {

			
			// ��� iterable �� null�� ������� ��
			if (iterable != null) {
				
				//��ͨ����ʹ�� for( in ) , ������ 0 -> length  ��
				if (iterable.length === undefined) {
					
					// Object ������
					for (var t in iterable) 
						if (fn.call(bind, iterable[t], t, iterable) === false) 
							return false;
				} else {
					return each.call(iterable, fn, bind);
				}
				
			}
			
			// ����������
			return true;
		},

		/**
		 * ����һ���ɵ�������
		 * @param {Array/Object} iterable ���󣬲�֧�ֺ�����
		 * @param {Function} fn ��ÿ���������õĺ����� {@param {Object} value ��ǰ������ֵ} {@param {Number} key ��ǰ����������} {@param {Array} array ���鱾��} {@return {Boolean} �����ֹѭ���� ���� false��}
	 	 * @param {Object} bind=iterable ����ִ��ʱ��������
		 * @param {Object/Boolean} [args] ����/�Ƿ��Ӵ��ݡ�
		 * @return {Object}  ���صĶ���
		 * @example 
		 * �ú���֧�ֶ�����ܡ���Ҫ�����ǽ�һ���������һ����ϵ����µĶ���
		 * <code>
		 * Object.update(["aa","aa23"], "length", []); // => [2, 4];
		 * Object.update([{a: 1},{a: 4}], "a", [{},{}], true); // => [{a: 1},{a: 4}];
		 * </code>
		 * */
		update: function (iterable, fn, dest, args) {
			
			// ���û��Ŀ�꣬Դ��Ŀ��һ�¡�
			dest = dest || iterable;
			
			// ����Դ��
			o.each(iterable, Function.isFunction(fn) ? function (value, key) {
                
				// ִ�к�����÷��ء�
				value = fn.call(args, value, key);
				
				// ֻ�в��� undefined ���¡�
                if(value !== undefined)
				    dest[key] = value;
			} : function (value, key) {
				
				// ����������ֵ����Դ�� fn ���ݡ�
				if(value != undefined) {
					
					value = value[fn];
					
					
					// ��������ǷǺ�������˵�����¡� a.value -> b.value
					if(args)
						dest[key][fn] = value;
						
					// ���ƺ����ĸ��¡� a.value -> value
					else
						dest[key] = value;
				}
                    
			});
			
			// ����Ŀ�ꡣ
			return dest;
		},

		/**
		 * �ж�һ�������Ƿ������ñ�����
		 * @param {Object} object ������
		 * @return {Boolean} ���ж���������� true, null ���� false ��
		 * @example
		 * <code>
		 * Object.isObject({}); // true
		 * Object.isObject(null); // false
		 * </code>
		 */
		isObject: function (obj) {
			
			// ֻ��� null ��
			return obj !== null && typeof obj == "object";
		},
		
		/**
		 * ��һ�����������һ��������ԡ�
		 * @param {Object} obj ��ʵ����
		 * @param {Object} options ������
		 * ���������������󣬲���ͼ�ҵ�һ�� �������ú�����
		 * �����ö��� obj �� ���� key Ϊ value:
		 * ��������Щ��:
		 *      ��飬������ھ͵���: obj.setKey(value)
		 * ���� ��飬������ھ͵���: obj.key(value)
		 * ���� ��飬������ھ͵���: obj.key.set(value)
		 * ���򣬼�飬������ھ͵���: obj.set(value)
		 * ����ִ�� obj.key = value;
		 * 
		 * @example
		 * <code>
		 * document.setA = function (value) {
		 * 	  this._a = value;
		 * };
		 * 
		 * Object.set(document, 'a', 3); 
		 * 
		 * // ���������     document.setA(3);
		 * 
		 * </code>
		 */
		set: function (obj, options) {
			
			for(var key in options) {
				
				// ��� setValue ��
				var setter = 'set' + key.capitalize(),
					val = options[key];
		
		
				if (Function.isFunction(obj[setter]))
					obj[setter](val);
				
				// �Ƿ���ں�����
				else if(Function.isFunction(obj[key]))
					obj[key](val);
				
				// ��� value.set ��
				else if (obj[key] && obj[key].set)
					obj[key].set(val);
				
				// ��� set ��
				else if(obj.set)
					obj.set(key, val);
				
				// ��󣬾�ֱ�Ӹ��衣
				else
					obj[key] = val;
		
			}
			
		},
		
		/**
		 * ����һ�����������͵��ַ�����ʽ��
		 * @param {Object} obj ������
		 * @return {String} ���п��Է��ص��ַ�����  string  number   boolean   undefined	null	array	function   element  class   date   regexp object��
		 * @example
		 * <code> 
		 * Object.type(null); // "null"
		 * Object.type(); // "undefined"
		 * Object.type(new Function); // "function"
		 * Object.type(+'a'); // "number"
		 * Object.type(/a/); // "regexp"
		 * Object.type([]); // "array"
		 * </code>
		 * */
		type: function (obj) {
			
			//�������  ��
			var typeName = typeof obj;
			
			// ���� ֱ�ӻ�ȡ xType ��
			return obj ? obj.xType || typeName : obj === null ? "null" : typeName;
			
		}

	});

	/**
	 * ���顣
	 * @namespace Array
	 */
	applyIf(Array, {
		
		/**
		 * �ж�һ�������Ƿ������顣
		 * @param {Object} object ������
		 * @return {Boolean} ��������飬���� true�� ���򷵻� false��
		 * @example
		 * <code> 
		 * Array.isArray([]); // true
		 * Array.isArray(document.getElementsByTagName("div")); // false
		 * Array.isArray(new Array); // true
		 * </code>
		 */
		isArray: $.isArray,

		/**
		 * ��ԭ�пɵ�����������һ�����顣
		 * @param {Object} iterable �ɵ�����ʵ����
		 * @param {Number} startIndex=0 ��ʼ��λ�á�
		 * @return {Array} ���Ƶõ������顣
		 * @example
		 * <code>
		 * Array.create([4,6], 1); // [6]
		 * </code>
		 */
		create: $.makeArray

	});

	/**
	 * ������
	 * @namespace Function
	 */
	apply(Function, {
		
		/**
		 * �󶨺���������
		 * @param {Function} fn ������
		 * @param {Object} bind λ�á�
		 * ע�⣬δ�� Function.prototype.bind ��ϵͳ������ ���������������Ǹ�ʱ�� �滻����
		 * @example
		 * <code>
		 * Function.bind(function () {return this}, 0)()    ; // 0
		 * </code>
		 */
		bind: function (fn, bind) {
			
			// ���ض� bind �󶨡�
			return function () {
				return fn.apply(bind, arguments);
			}
		},
		
		/**
		 * �պ�����
		 * @property
		 * @type Function
		 * Function.empty���ؿպ��������á�
		 */
		empty: emptyFn,

		/**
		 * һ������ true �ĺ�����
		 * @property
		 * @type Function
		 */
		returnTrue: from(true),

		/**
		 * һ������ false �ĺ�����
		 * @property
		 * @type Function
		 */
		returnFalse: from(false),

		/**
		 * �ж�һ�������Ƿ��Ǻ�����
		 * @param {Object} object ������
		 * @return {Boolean} ����Ǻ��������� true�� ���򷵻� false��
		 * @example
		 * <code>
		 * Function.isFunction(function () {}); // true
		 * Function.isFunction(null); // false
		 * Function.isFunction(new Function); // true
		 * </code>
		 */
		isFunction: $.isFunction,
		
		/**
		 * ��������ĺ�����
		 * @param {Object} v ��Ҫ���صĲ�����
		 * @return {Function} ִ�еõ�������һ��������
		 * @hide
		 * @example
		 * <code>
		 * Function.from(0)()    ; // 0
		 * </code>
		 */
		from: from
		
	});

	/**
	 * �ַ�����
	 * @namespace String
	 */
	apply(String, {

		/**
		 * ��ʽ���ַ�����
		 * @param {String} format �ַ���
		 * @param {Object} ... ������
		 * @return {String} ��ʽ������ַ�����
		 * @example
		 * <code>
		 *  String.format("{0}ת��", 1); //  "1ת��"
		 *  String.format("{1}����",0,1); // "1����"
		 *  String.format("{a}����",{a:"Ҳ����"}); // Ҳ���Է���
		 *  String.format("{{0}}��ת��, {0}ת��", 1); //  "{0}��ת��1ת��"
		 *  ��ʽ�����ַ���{}����������ո�
		 *  ��Ҫ����{{{ ��  }}} ��������ò���Ԥ֪�Ľ����
		 * </code>
		 */
		format: function (format, args) {
					

			//֧�ֲ���2Ϊ���������ֱ�Ӹ�ʽ����
			var toString = this;
			
			args = arguments.length === 2 && o.isObject(args) ? args: [].slice.call(arguments, 1);

			//ͨ����ʽ������
			return (format || "").replace(rFormat, function (match, name) {
				var start = match.charAt(1) == '{',
					end = match.charAt(match.length - 2) == '}';
				if (start || end) return match.slice(start, match.length - end);
				//LOG : {0, 2;yyyy} Ϊ��֧�������ʽ, ���������ﴦ�� match , ͬʱΪ�˴�����, ��ȥ�ù��ܡ�
				return name in args ? toString(args[name]) : "";
			});
		},
		
		/**
		 * ��һ������Դ��ʽ���ַ������ݿ�����
		 * @param {Object} str �ַ������ÿո������
		 * @param {Object/Function} source ���µĺ�����Դ��
		 * @param {Object} [dest] ���ָ���ˣ� �򿽱���������Ŀ�ꡣ
		 * @param {Boolean} copyIf=false �Ƿ������������ڵ����ݡ�
		 * @example
		 * <code>
		 * String.map("aaa bbb ccc", trace); //  aaa bbb ccc
		 * String.map("aaa bbb ccc", function (v) { return v; }, {});    //    {aaa:aaa, bbb:bbb, ccc:ccc};
		 * </code>
		 */
		map: function (str, src, dest, copyIf) {
					
			
			var isFn = Function.isFunction(src);
			// ʹ�� ' '���ָ�, ����Լ���ġ�
			str.split(' ').forEach(function (value, index, array) {
				
				// ����Ǻ��������ú����� ���������ԡ�
				var val = isFn ? src(value, index, array) : src[value];
				
				// ����� dest �����ơ�
				if(dest && !(copyIf && (value in dest)))
					dest[value] = val;
			});
			return dest;
		},
		
		/**
		 * ���ر����ĵ�ַ��ʽ��
		 * @param {Object} obj ������
		 * @return {String} �ַ�����
		 * @example
		 * <code>
		 * String.param({a: 4, g: 7}); //  a=4&g=7
		 * </code>
		 */
		param: $.param,
	
		/**
		 * ���ַ���תΪָ�����ȡ�
		 * @param {String} value   �ַ�����
		 * @param {Number} len ��Ҫ����󳤶ȡ�
		 * @example
		 * <code>
		 * String.ellipsis("123", 2); //   '1...'
		 * </code>
		 */
		ellipsis: function (value, len) {
			return value.length > len ?  value.substr(0, len - 3) + "..." : value;
		}
		
	});
	
	Date.now =  $.now;

	/**
	 * �������
	 * @namespace navigator
	 */
	applyIf(navigator, (function (ua, isNonStandard) {

		//�����Ϣ
		var match = ua.match(/(IE|Firefox|Chrome|Safari|Opera|Navigator).((\d+)\.?[\d.]*)/i) || ["", "Other", 0, 0],
			
			// �汾��Ϣ��
			version = ua.match(/(Version).((\d+)\.?[\d.]*)/i) || match,
			
			// ��������֡�
			browser = match[1];
		
		
		navigator["is" + browser] = navigator["is" + browser + version[3]] = true;
		
		/**
		 * ��ȡһ��ֵ����ֵָʾ�Ƿ�Ϊ IE �������
		 * @getter isIE
		 * @type Boolean
		 */
		
		
		/**
		 * ��ȡһ��ֵ����ֵָʾ�Ƿ�Ϊ Firefox �������
		 * @getter isFirefox
		 * @type Boolean
		 */
		
		/**
		 * ��ȡһ��ֵ����ֵָʾ�Ƿ�Ϊ Chrome �������
		 * @getter isChrome
		 * @type Boolean
		 */
		
		/**
		 * ��ȡһ��ֵ����ֵָʾ�Ƿ�Ϊ Opera �������
		 * @getter isOpera
		 * @type Boolean
		 */
		
		/**
		 * ��ȡһ��ֵ����ֵָʾ�Ƿ�Ϊ Safari �������
		 * @getter isSafari
		 * @type Boolean
		 */
		
		//���
		return {
			
			/// #ifdef SupportIE6
			
			/**
			 * ��ȡһ��ֵ����ֵָʾ��ǰ������Ƿ�֧�ֱ�׼�¼�����Ŀǰ�����״���� IE6��7 �� isQuirks = true  ������ false ��
			 * @type Boolean
			 * �˴���Ϊ IE6,7 �ǹ��ġ�
			 */
			isQuirks: isNonStandard && !o.isObject(document.constructor),
			
			/// #endif
			
			/// #ifdef SupportIE8
			
			/**
			 * ��ȡһ��ֵ����ֵָʾ��ǰ������Ƿ�Ϊ��׼�������
			 * @type Boolean
			 * �˴���Ϊ IE6, 7, 8 ���Ǳ�׼���������
			 */
			isStandard: !isNonStandard,
			
			/// #endif
			
			/**
			 * ��ȡ��ǰ������ļ�д��
			 * @type String
			 */
			name: browser,
			
			/**
			 * ��ȡ��ǰ������汾��
			 * @type String
			 * ����ĸ�ʽ���� 6.0.0 ��
			 * ����һ���ַ����������Ҫ�Ƚϰ汾��Ӧ��ʹ�� parseFloat(navigator.version) < 4 ��
			 */
			version: version[2]
			
		};
	
	})(navigator.userAgent, !-[1,]));

	/**
	 * xType��
	 */
	Date.prototype.xType = "date";
	
	/**
	 * xType��
	 */
	RegExp.prototype.xType = "regexp";
	
	
	// �������ڽ����󱾵ػ� ��
	each.call([String, Array, Function, Date, Number], p.Native);
	
	/**
	 * @class JPlus.Object
	 */
	Object.implement({
		
		/**
		 * ���ø���ĳ�Ա������
		 * @param {String} methodName ��������
		 * @param {Object} ... ���õĲ������顣
		 * @return {Object} ���෵�ء�
		 * ע��ֻ�ܴ������е��ø����ͬ����Ա��
		 * @protected
		 * @example
		 * <code>
		 * 
		 * var MyBa = new Class({
		 *    a: function (g, b) {
		 * 	    alert(g + b);
		 *    }
		 * });
		 * 
		 * var MyCls = MyBa.extend({
		 * 	  a: function (g, b) {
		 * 	    this.base('a', g, b);   // ��   this.base('a', arguments);
		 *    }
		 * });
		 * 
		 * new MyCls().a();   
		 * </code>
		 */
		base: function (methodName, args) {
			
			var me = this.constructor,
			
				fn = this[methodName];
				
			
			// ��ǵ�ǰ��� fn ��ִ�С�
			fn.$bubble = true;
				
			
			// ��֤�õ����Ǹ���ĳ�Ա��
			
			do {
				me = me.base;
			} while('$bubble' in (fn = me.prototype[methodName]));
			
			
			fn.$bubble = true;
			
			// ȷ�� bubble �Ǻű��Ƴ���
			try {
				if(args === arguments.callee.caller.arguments)
					return fn.apply(this, args);
				arguments[0] = this;
				return fn.call.apply(fn, arguments);
			} finally {
				delete fn.$bubble;
			}
		}
	
	});
	
	/**
	 * @class String 
	 */
	String.implementIf({

		/// #ifdef SupportIE8

		/**
		 * ȥ����β�ո�
		 * @return {String}    �������ַ�����
	     * @example
		 * <code>
		 * "   g h   ".trim(); //     "g h"
		 * </code>
		 */
		trim: function () {
			
			// ʹ������ʵ�֡�
			return $.trim(this);
		},
		
		/// #endif
		
		/**
	     * תΪ���ո�ʽ��
	     * @param {String} value ���ݡ�
	     * @return {String} ���ص����ݡ�
	     * @example
		 * <code>
		 * "font-size".toCamelCase(); //     "fontSize"
		 * </code>
	     */
		toCamelCase: function () {
	        return this.replace(rToCamelCase, toUpperCase);
	    },
		
		/**
		 * ���ַ�����ĸ��д��
		 * @return {String} ��д���ַ�����
	     * @example
		 * <code>
		 * "bb".capitalize(); //     "Bb"
		 * </code>
		 */
		capitalize: function () {
			
			// ʹ������ʵ�֡�
			return this.replace(rFirstChar, toUpperCase);
		}

	});
	
	/**
	 * @class Array
	 */
	Array.implementIf({

		/**
		 * ����������һ��������
		 * @param {Function} fn ����.���� value, index
		 * @param {Object} bind ����
		 * @return {Boolean} ����ִ���ꡣ
		 * @method
		 * @seeAlso Array.prototype.forEach
		 * @example
		 * <code> 
		 * [2, 5].each(function (value, key) {
		 * 		trace(value);
		 * 		return false
		 * });
		 * // ��� '2'
		 * </code>
		 */
		each: each,

		/// #ifdef SupportIE8

		/**
		 * ��������ĳ��ֵ�ĵ�һ��λ�á�ֵû��,��Ϊ-1 ��
		 * @param {Object} item ��Ա��
		 * @param {Number} start=0 ��ʼ���ҵ�λ�á�
		 * @return Number λ�ã��Ҳ������� -1 �� 
		 * ���ڴ����������Ѻ��˺���.���� IE8-  ��
		 */
		indexOf: function (item, startIndex) {
			startIndex = startIndex || 0;
			for (var len = this.length; startIndex < len; startIndex++)
				if (this[startIndex] === item)
					return startIndex;
			return -1;
		},
		
		/**
		 * ������ÿ��Ԫ��ͨ��һ���������ˡ��������з���Ҫ���Ԫ�ص����顣
		 * @param {Function} fn ���������� value, index, this��
		 * @param {Object} bind �󶨵Ķ���
		 * @return {Array} �µ����顣
		 * @seeAlso Array.prototype.select
		 * @example
		 * <code> 
		 * [1, 7, 2].filter(function (key) {return key &lt; 5 })   [1, 2]
		 * </code>
		 */
		filter: function (fn, bind) {
			var r = [];
			[].forEach.call(this, function (value, i, array) {
				
				// ���˲����ڵĳ�Ա��
				if(fn.call(this, value, i, array))
					r.push(value);
			}, bind);
			
			return r;

		},

		/**
		 * �������ڵ����б���ִ�к���������ѡ����������
		 * @method
		 * @param {Function} fn ��ÿ���������õĺ����� {@param {Object} value ��ǰ������ֵ} {@param {Number} key ��ǰ����������} {@param {Number} index ��ǰ����������} {@param {Array} array ���鱾��}
		 * @param {Object} bind ����ִ��ʱ��������
		 * @seeAlso Array.prototype.each
		 * @example
		 * <code> 
		 * [2, 5].forEach(function (value, key) {
		 * 		trace(value);
		 * });
		 * // ��� '2' '5'
		 * </code>
		 * */
		forEach: each,
		
		/// #endif

		/**
		 * ����һ��Ԫ�ء�Ԫ�ش���ֱ�ӷ��ء�
		 * @param {Object} value ֵ��
		 * @return {Boolean} �Ƿ����Ԫ�ء�
		 * @example
		 * <code>
		 * ["", "aaa", "zzz", "qqq"].include(""); //   true
		 * [false].include(0);	//   false
		 * </code>
		 */
		include: function (value) {
			
			//δ����������롣
			var b = this.indexOf(value) !== -1;
			if(!b)
				this.push(value);
			return b;
		},
		
		/**
		 * ��ָ��λ�ò����
		 * @param {Number} index �����λ�á�
		 * @param {Object} value ��������ݡ�
		 * @example
		 * <code>
		 * ["", "aaa", "zzz", "qqq"].insert(3, 4); //   ["", "aaa", "zzz", 4, "qqq"]
		 * </code>
		 */
		insert: function (index, value) {
			var me = this,
				tmp = [].slice.call(me, index);
			me.length = index + 1;
			this[index] = value;
			[].push.apply(me, tmp);
			return me;
			
		},
		
		/**
		 * �������Ա����ָ���ĳ�Ա�����ؽ�����顣
		 * @param {String} func ���õĳ�Ա����
		 * @param {Array} args ���õĲ������顣
		 * @return {Array} �����
		 * @example
		 * <code>
		 * ["vhd"].invoke('charAt', [0]); //    ['v']
		 * </code>
		 */
		invoke: function (func, args) {
			var r = [];
			[].forEach.call(this, function (value) { 
				r.push(value[func].apply(value, args));
			});
			
			return r;
		},
		
		/**
		 * ɾ���������ظ�Ԫ�ء�
		 * @return {Array} �����
		 * @example
		 * <code>
		 * [1,7,8,8].unique(); //    [1, 7, 8]
		 * </code>
		 */
		unique: function () {
			
			return $.unique(this);
		},
		
		/**
		 * ɾ��Ԫ��, ����ΪԪ�ص����ݡ�
		 * @param {Object} value ֵ��
		 * @return {Number} ɾ����ֵ��λ�á�
		 * @example
		 * <code>
		 * [1,7,8,8].remove(7); //   1
		 * </code>
		 */
		remove: function (value, startIndex) {
			
			// �ҵ�λ�ã� Ȼ��ɾ��
			var i = [].indexOf.call(this, value, startIndex);
			if(i !== -1) [].splice.call(this, i, 1);
			return i;
		},
			
		/**
		 * ��ȡָ��������Ԫ�ء���� index < 0�� ���ȡ���� index Ԫ�ء�
		 * @param {Number} index Ԫ�ء�
		 * @return {Object} ָ��λ�����ڵ�Ԫ�ء�
		 * @example
		 * <code>
		 * [1,7,8,8].item(0); //   1
		 * [1,7,8,8].item(-1); //   8
		 * [1,7,8,8].item(5); //   undefined
		 * </code>
		 */
		item: function (index) {
			return this[index < 0 ? this.length + index : index];
		},
		
		/**
		 * xType��
		 */
		xType: "array"

	});
	
	/**
	 * @class
	 */
	
	/// #endregion

	/// #region ҳ��
	
		
	if(!window.execScript)
	
		/**
		 * ȫ������һ��������
		 * @param {String} statement ��䡣
		 * @return {Object} ִ�з���ֵ��
		 * @example
		 * <code>
		 * execScript('alert("hello")');
		 * </code>
		 */
		window.execScript = function(statements) {
			
			// ��������������ʹ�� window.eval  ��
			window.eval(statements);

		};
		
	// �����³�Ա���� window ����Щ��Ա��ȫ�ֳ�Ա��
	String.map('undefined Class IEvent using namespace', p, window);
	
	IEvent.bind = IEvent.on;
	IEvent.unbind = IEvent.un;
	
	/**
	 * id���� ��
	 * @type Number
	 */
	p.id = Date.now() % 100;

	/// #endregion
	
	/// #region ����
	
	/**
	 * ��������ھ͸����������Ե��κζ��� 
	 * @param {Object} dest ����Ŀ�ꡣ
	 * @param {Object} src Ҫ���Ƶ����ݡ�
	 * @return {Object} ���ƺ�Ķ���
	 */
	function applyIf(dest, src) {
		
		
		// �� apply ���ƣ�ֻ���ж�Ŀ���ֵ�Ƿ�Ϊ undefiend ��
		for (var b in src)
			if (dest[b] === undefined)
				dest[b] = src[b];
		return dest;
	}

	/**
	 * ����������һ��������
	 * @param {Function} fn �����ĺ������������� value, index, array ��
	 * @param {Object} bind ����
	 * @return {Boolean} ����һ������ֵ����ֵָʾ����ѭ��ʱ�����޳���һ���������� false ����ֹѭ����
	 */
	function each(fn, bind) {
		
		
		var i = -1,
			me = this;
			
		while (++i < me.length)
			if(fn.call(bind, me[i], i, me) === false)
				return false;
		return true;
	}
	
	/**
	 * �����Զ�����Ļ��ࡣ
	 */
	function Object() {
	
	}
	
	/**
	 * ���ط���ָ������ĺ�����
	 * @param {Object} ret �����
	 * @return {Function} ������
	 */
	function from(ret) {
		
		// ����һ��ֵ�����ֵ�ǵ�ǰ�Ĳ�����
		return function () {
			return ret;
		}
	}
	
	/**
	 * ��һ���ַ�תΪ��д��
	 * @param {String} match �ַ���
	 */
	function toUpperCase(ch, match) {
		return match.toUpperCase();
	}
	
	/**
	 * ��ȡָ���Ķ������е��¼���������
	 * @param {Object} obj Ҫʹ�õĶ���
	 * @param {String} type �¼�����
	 * @return {Object} ����Ҫ����¼�������������Ҳ������ʵģ�����Ĭ�ϵ��¼���������
	 */
	function getMgr(eMgr, type) {
		var evt = eMgr.constructor;
		
		// �������࣬ �ҵ��ʺϵ� eMgr ��
		while(!(eMgr = eventMgr[eMgr.xType]) || !(eMgr = eMgr[type])) {
			
			if(evt && (evt = evt.base)) {
				eMgr = evt.prototype;
			} else {
				return eventMgr.$default;
			}
		
		}
		
		return eMgr;
	}

	/**
	 * �������ֿռ䡣
	 * @param {String} ns ���ֿռ䡣
	 * @param {Object} obj ֵ��
	 */
	function namespace(ns, obj) {
		
		
		
		// ��������
		if (arguments.length == 1) {
			
			return;
		}
		
		// ȡֵ��������
		ns = ns.split('.');
		
		// �����1���ַ��� ., ���ʾ����ʹ�õ����ֿռ䡣
		var current = window, i = -1, len = ns.length - 1, dft = !ns[0];
		
		// �����һ���ַ��� . ����Ĭ�ϵ����ֿռ䡣
		ns[0] = ns[0] || p.defaultNamespace;
		
		// ���δ�������
		while(++i < len)
			current = current[ns[i]] || (current[ns[i]] = {});

  		// ������һ�������� . �򸲸ǵ����һ������ ������µ�ĩβ��
		if(i = ns[len])
			current[i] = applyIf(obj, current[i] || {});
		else {
			obj = applyIf(current, obj);
			i = ns[len - 1];
		}
		
		// ���������ʹ�õ����ֿռ䣬�����һ����Ա����Ϊȫ�ֶ���
		if(dft)
			window[i] = obj;
		
		return obj;
		
		
		
	}

	/// #endregion

})(jQuery);




function assert(bValue, msg){
	if (!bValue){
		var val = arguments;

		// ������� [����] ����
		if (val.length > 2) {
			var i = 2;
			msg = msg.replace(/\{([\w\.\(\)]*?)\}/g, function (s, x) {
				return val.length <= i ? s : x + " = " + String.ellipsis(trace.inspect(val[i++]), 200);
			});
		}else {
			msg = msg || "����ʧ��";
		}
		
		throw new Error(msg);
	}
}




//===========================================
//  jQuery plugin - J+ Element Adapter
//===========================================

(function ($) {
	
	/**
	 * Object  ��д��
	 * @type Object
	 */
	var o = Object,
		
		/**
		 * Object.extend
		 * @type Function
		 */
		apply = o.extend,
	
		/**
		 * ����ԭ�͡�
		 * @type Object
		 */
		ap = Array.prototype,
		
		/**
		 * String.map ��д��
		 * @type Object
		 */
		map = String.map,
		
		/**
		 * JPlus ��д��
		 * @namespace JPlus
		 */
		p = JPlus,
		
		/// #ifdef SupportIE6
		
		/**
		 * Ԫ�ء�
		 * @type Function
		 * ���ҳ���Ѿ����� Element�� �����ǲ����û��Զ���ģ���ֱ��ʹ�á�ֻ�豣֤ Element ��һ���������ɡ�
		 */
		e = window.Element || function() {},
		
		/// #else
		
		/// e = window.Element,
		
		/// #endif
		
		/**
		 * Ԫ��ԭ�͡�
		 * @type Object
		 */
		ep = e.prototype,
	
		/**
		 * ���ڲ��Ե�Ԫ�ء�
		 * @type Element
		 */
		div = document.createElement('DIV'),
		
		/**
		 * ����һ�� id ��ȡԪ�ء���������id�����ַ�������ֱ�ӷ��ز�����
		 * @param {String/Element/Control} id Ҫ��ȡԪ�ص� id ��Ԫ�ء�
		 */
		$$ = getElementById,
	
		/// #endif

		/// #ifdef ElementAttribute
	
		/**
		 * ��ʾ�¼��ı��ʽ��
		 * @type RegExp
		 */
		rEventName = /^on(\w+)/,
	
		/// #endif
	
		/// #ifdef SupportIE8
	
		/**
		 * ��ȡԪ�ص�ʵ�ʵ���ʽ���ԡ�
		 * @param {Element} elem ��Ҫ��ȡ���ԵĽڵ㡣
		 * @param {String} name ��Ҫ��ȡ��CSS�������֡�
		 * @return {String} ������ʽ�ַ����������� undefined�� auto ����ַ�����
		 */
		getStyle = $.css,

		/// #if defined(ElementAttribute) || defined(ElementStyle)
	
		/**
		 * �Ƿ����Ե�������ʽ��
		 * @type RegExp
		 */
		rStyle = /-(\w)|float/,
	
		/// #endif
		
		/// #ifdef ElementEvent
		
		/**
		 * @class Event
		 * ����֧���Զ����¼����¼�����
		 */
		pep = {
	
			/**
			 * ���캯����
			 * @param {Object} target �¼������Ŀ�ꡣ
			 * @param {String} type �¼���������͡�
			 * @param {Object} [e] �¼���������ԡ�
			 * @constructor
			 */
			constructor: function (target, type, e) {
				
				var me = this;
				me.target = target;
				me.srcElement = $$(target.dom || target);
				me.type = type;
				apply(me, e);
			},

			/**
			 * ��ֹ�¼���ð�ݡ�
			 * @remark
			 * Ĭ������£��¼�����Ԫ��ð�ݡ�ʹ�ô˺�����ֹ�¼�ð�ݡ�
			 */
			stopPropagation : function () {
				this.cancelBubble = true;
			},
					
			/**
			 * ȡ��Ĭ���¼�������
			 * @remark
			 * ��Щ�¼�����Ĭ����Ϊ����������֮��ִ����ת��ʹ�ô˺�����ֹ��ЩĬ����Ϊ��
			 */
			preventDefault : function () {
				this.returnValue = false;
			},
			
			/**
			 * ֹͣĬ���¼���ð�ݡ�
			 * @remark
			 * �˺���������ȫ�����¼���
			 * �¼��������� return false �͵��� stop() �ǲ�ͬ�ģ� return false ֻ����ֹ��ǰ�¼���������ִ�У�
			 * �� stop() ֻ��ֹ�¼�ð�ݺ�Ĭ���¼�������ֹ��ǰ�¼�����������
			 */
			stop: function () {
				this.stopPropagation();
				this.preventDefault();
			}
			
		},
	
		/**
		 * @type Function
		 */
		initUIEvent,
	
		/**
		 * @type Function
		 */
		initMouseEvent,
	
		/**
		 * @type Function
		 */
		initKeyboardEvent,
		
		/// #endif
		
		/// #if !defind(SupportIE8) && (ElementEvent || ElementDomReady)
		
		/**
		 * ��չ���¼�����
		 */
		eventObj = {
			
			/**
			 * ��һ����������
			 * @method
			 * @param {String} type ���͡�
			 * @param {Function} listener ������
			 * @seeAlso removeEventListener
			 * @example
			 * <code>
			 * document.addEventListener('click', function () {
			 * 	
			 * });
			 * </code>
			 */
			addEventListener: document.addEventListener ? function (type, listener) {
				
				//  ��Ϊ IE ��֧�֣����Ժ��� ������������
				this.addEventListener(type, listener, false);
				
			} : function (type, listener) {
			
				// IE8- ʹ�� attachEvent ��
				this.attachEvent('on' + type, listener);
				
			},
	
			/**
			 * �Ƴ�һ����������
			 * @method
			 * @param {String} type ���͡�
			 * @param {Function} listener ������
			 *  @param {Boolean} state ���͡�
			 * @seeAlso addEventListener
			 * @example
			 * <code>
			 * document.removeEventListener('click', function () {
			 * 
			 * });
			 * </code>
			 */
			removeEventListener: document.removeEventListener ? function (type, listener) {
			
				//  ��Ϊ IE ��֧�֣����Ժ��� ������������
				this.removeEventListener(type, listener, false);
				
			}:function (type, listener) {
			
				// IE8- ʹ�� detachEvent ��
				this.detachEvent('on' + type, listener);
				
			}
		
		},
		
		/// #endif
		
		/// #endif
		
		/// #ifdef ElementDimension
		
		/**
		 * �ж� body �ڵ��������ʽ��
		 * @type RegExp
		 */
		rBody = /^(?:BODY|HTML|#document)$/i,
		
		/**
		 * �����Ƿ��Ǿ���λ�õ�������ʽ��
		 * @type RegExp
		 */
		rMovable = /^(?:abs|fix)/,
		
		/**
		 * ��ȡ���ڹ�����С�ķ�����
		 * @type Function
		 */
		getWindowScroll,
		
		/// #endif
	
		/**
		 * һ���㡣
		 * @class Point
		 */
		Point = namespace(".Point", Class({
	
			/**
			 * ��ʼ�� Point ��ʵ����
			 * @param {Number} x X ���ꡣ
			 * @param {Number} y Y ���ꡣ
			 * @constructor Point
			 */
			constructor: function (x, y) {
				this.x = x;
				this.y = y;
			},
	
			/**
			 * �� (x, y) ��ֵ��
			 * @param {Point} p ֵ��
			 * @return {Point} this
			 */
			add: function (p) {
				return new Point(this.x + p.x, this.y + p.y);
			},
	
			/**
			 * ��һ�������������ǰֵ��
			 * @param {Point} p ֵ��
			 * @return {Point} this
			 */
			sub: function (p) {
				return new Point(this.x - p.x, this.y - p.y);
			}
			
		})),
		
		/**
		 * �ĵ�����
		 * @class Document
		 * �ĵ������Ƕ�ԭ�� HTMLDocument ����Ĳ��䣬 ��Ϊ IE6/7 ��������Щ����
		 * ��չ Document Ҳ����չ HTMLDocument��
		 */
		Document = p.Native(document.constructor || {prototype: document}),
		
		/**
		 * ���пؼ����ࡣ
		 * @class Control
		 * @abstract
		 * @extends Element
		 * �ؼ������ڣ�
		 * constructor  -  �����ؼ����ڵ� Javascript �ࡣ ��������д��������֪��������ʲô��
		 * create - ��������� dom �ڵ㡣 ����д - Ĭ��ʹ��  this.tpl ������
		 * init - ��ʼ���ؼ����� ����д - Ĭ��Ϊ�޲�����
		 * render - ��Ⱦ�ؼ����ĵ��� ��������д�������ϣ�����������Ⱦ�¼�������д��
		 * detach - ɾ���ؼ�����������д�����һ���ؼ��õ���� dom ��������д��
		 */
		Control = namespace(".Control", Class({
			
			/**
			 * ��װ�Ľڵ㡣
			 * @type Element
			 */
			dom: null,
			
			/**
			 * xType ��
			 */
			xType: "control",
		
			/**
			 * ����һ���ڵ㷵�ء�
			 * @param {String/Element/Object} [options] ����� id ������������á�
			 */
			constructor: function (options) {
				
				// �������пؼ����õĹ��캯����
				
				var me = this,
				
					// ��ʱ�����ö���
					opt = apply({}, me.options),
					
					// ��ǰʵ�ʵĽڵ㡣
					dom;
					
				
				// ����������á�
				if (options) {
					
					// ���������һ�� DOM �ڵ�� ID ��
					if (typeof options == 'string' || options.nodeType) {
						
						// ֱ�Ӹ�ֵ�� �������� $ ��ȡ�ڵ� ��
						dom = options;
					} else {
						
						// ���� options ��һ������
						
						// ���Ƴ�Ա����ʱ���á�
						apply(opt, options);
						
						// ���� dom ��
						dom = opt.dom;
						delete opt.dom;
					}
				}
				
				// ��� dom ��ȷ���ڣ�ʹ���Ѵ��ڵģ� ����ʹ�� create(opt)���ɽڵ㡣
				me.dom = dom ? $$(dom) : me.create(opt);
				
				
				// ���� init ��ʼ���ؼ���
				me.init(opt);
				
				// ������ʽ��
				if('style' in opt) {
					me.dom.style.cssText += ';' + opt.style;
					delete opt.style;
				}
				
				// ���Ƹ���ѡ�
				Object.set(me, opt);
			},
			
			/**
			 * ����������дʱ�����ɵ�ǰ�ؼ���
			 * @param {Object} options ѡ�
			 * @protected
			 */
			create: function() {
				
				
				// תΪ�� tpl������
				return Element.parse(this.tpl);
			},
			
			/**
			 * ����������дʱ����Ⱦ�ؼ���
			 * @method
			 * @param {Object} options ���á�
			 * @protected
			 */
			init: Function.empty,
			
			/**
			 * ������ǰ�ڵ�ĸ����������ؽڵ�İ�װ��
			 * @param {cloneContent} �Ƿ������� ��
		     * @return {Control} �µĿؼ���
			 */
			cloneNode: function (cloneContent) {
				return new this.constructor(this.dom.cloneNode(cloneContent));
			},
			
			/**
		     * ���������ؿؼ��ĸ�����
		     * @param {Boolean} keepId=fasle �Ƿ��� id ��
		     * @return {Control} �µĿؼ���
		     */
			clone: function(keepId) {
				
				// ����һ���ؼ���
				return  new this.constructor(this.dom.nodeType === 1 ? this.dom.clone(false, true, keepId) : this.dom.cloneNode(!keepId));
				
			}
			
		})),
		
		/**
		 * �ڵ㼯�ϡ�
		 * @class ElementList
		 * @extends Array
		 * ElementList �Ƕ�Ԫ�������ֻ����װ��
		 * ElementList ������ٲ�������ڵ㡣
		 * ElementList ��ʵ��һ���������������޸����Ա��
		 */
		ElementList = namespace(".ElementList", 
		
		/// #ifdef SupportIE6
		
		(navigator.isQuirks ? p.Object : Array)
		
		/// #else
		
		/// Array
		
		/// #endif
		
		.extend({
			
			/**
			 * ��ȡ��ǰ���ϵ�Ԫ�ظ�����
			 * @type {Number}
			 * @property
			 */
			length: 0,
	
			/**
			 * ��ʼ��   ElementList  ʵ����
			 * @param {Array/ElementList} doms �ڵ㼯�ϡ�
			 * @constructor
			 */
			constructor: function (doms) {
				
				if(doms) {
		
					
					var len = this.length = doms.length;
					while(len--)
						this[len] = doms[len];
		
					/// #ifdef SupportIE8
					
					// ����Ƿ���ҪΪÿ����Ա����  $ ������
					if(!navigator.isStandard)
						o.update(this, $$);
						
					/// #endif
				
				}
				
			},
			
			/**
			 * ������������ӵ���ǰ���ϡ�
			 * @param {Element/ElementList} value Ԫ�ء�
			 * @return this
			 */
			concat: function (value) {
				if(value) {
					value = value.length !== undefined ? value : [value];
					for(var i = 0, len = value.length; i < len; i++)
						this.include(value[i]);
				}
				
				return this;
			},
			
			/**
			 * ��ÿ��Ԫ��ִ�� cloneNode, �������µ�Ԫ�صļ��ϡ�
			 * @param {Boolean} cloneContent �Ƿ�����Ԫ�ء�
			 * @return {ElementList} ���ƺ����Ԫ����ɵ��¼��ϡ�
			 */
			cloneNode: function (cloneContent) {
				var i = this.length,
					r = new ElementList();
				while(i--)
					r[i] = this[i].cloneNode(cloneContent);
				return r;
			},
	
			/**
			 * xType
			 */
			xType: "elementlist"
	
		}));
	
	/// #ifdef SupportIE6
	
	if(navigator.isQuirks) {
		map("pop shift", ap, apply(apply(ElementList.prototype, ap), {
			
			push: function() {
				return ap.push.apply(this, o.update(arguments, $));
			},
			
			unshift: function() {
				return ap.unshift.apply(this, o.update(arguments, $));
			}
			
		}));
	}
	
	/// #endif

	map("filter slice splice reverse", function(func) {
		return function() {
			return new ElementList(ap[func].apply(this, arguments));
		};
	}, ElementList.prototype);
	
	/**
	 * ���� x, y ��ȡ {x: x y: y} ����
	 * @param {Number/Point} x
	 * @param {Number} y
	 * @static
	 * @private
	 */
	Point.format = formatPoint;
		
	/**
	 * @class Element
	 */
	apply(e, {
		
		/// #ifdef ElementCore
		
		/**
		 * ת��һ��HTML�ַ������ڵ㡣
		 * @param {String/Element} html �ַ���
		 * @param {Element} context ���ɽڵ�ʹ�õ��ĵ��е��κνڵ㡣
		 * @param {Boolean} cachable=true �Ƿ񻺴档
		 * @return {Element/TextNode/DocumentFragment} Ԫ�ء�
		 * @static
		 */
		parse: function (html, context, cachable) {

			
			// �Ѿ��� Element ��  ElementList��
			if(html.xType)
				return html;
			
			if(html.nodeType)
				return new Control(html);
				
			
			context = context && context.ownerDocument || document;
			
			if(/<\w+/.test(html) ) {

				var div =  $(html, context);
				
				return div.length === 1 ? $$(div[0]) : new ElementList(div);
			
			}
			
			return new Control( context.createTextNode(html));

		},
		
		/// #endif
		
		/// #ifdef ElementManipulation
			
		/**
		 * �ж�ָ���ڵ�֮�����޴����ӽڵ㡣
		 * @param {Element} elem �ڵ㡣
		 * @param {Element} child �ӽڵ㡣
		 * @return {Boolean} ���ȷʵ�����ӽڵ㣬�򷵻� true �� ���򷵻� false ��
		 */
		hasChild: div.compareDocumentPosition ? function (elem, child) {
			return !!(elem.compareDocumentPosition(child) & 16);
		} : function (elem, child) {
			while(child = child.parentNode)
				if(elem === child)
					return true;
					
			return false;
		},
		
		/// #endif
		
		/// #ifdef ElementTraversing
		
		/**
		 * ���� get �����ʶ���
		 * @type String
		 */
		treeWalkers: {
	
			// ȫ���ӽڵ㡣
			all: 'all' in div ? function (elem, fn) { // ��������
				var r = new ElementList;
				ap.forEach.call(elem.all, function(elem) {
					if(fn(elem))
						r.push(elem);
				});
				return  r;
			} : function (elem, fn) {
				var r = new ElementList, doms = [elem];
				while (elem = doms.pop()) {
					for(elem = elem.firstChild; elem; elem = elem.nextSibling)
						if (elem.nodeType === 1) {
							if (fn(elem))
								r.push(elem);
							doms.push(elem);
						}
				}
				
				return r;
			},
	
			// �ϼ��ڵ㡣
			parent: createTreeWalker(true, 'parentNode'),
	
			// ��һ���ڵ㡣
			first: createTreeWalker(true, 'nextSibling', 'firstChild'),
	
			// ����Ľڵ㡣
			next: createTreeWalker(true, 'nextSibling'),
	
			// ǰ��Ľڵ㡣
			previous: createTreeWalker(true, 'previousSibling'),
	
			// ���Ľڵ㡣
			last: createTreeWalker(true, 'previousSibling', 'lastChild'),
			
			// ȫ���ӽڵ㡣
			children: createTreeWalker(false, 'nextSibling', 'firstChild'),
			
			// �����ڵĽڵ㡣
			closest: function(elem, args) {
				return args(elem) ? elem : this.parent(elem, args);
			},
	
			// ȫ���ϼ��ڵ㡣
			parents: createTreeWalker(false, 'parentNode'),
	
			// ����Ľڵ㡣
			nexts: createTreeWalker(false, 'nextSibling'),
	
			// ǰ��Ľڵ㡣
			previouses: createTreeWalker(false, 'previousSibling'),
	
			// ��������
			odd: function(elem, args) {
				return this.even(elem, !args);
			},
			
			// ż������
			even: function (elem, args) {
				return this.children(elem, function (elem) {
					return args = !args;
				});
			},
	
			// �ֵܽڵ㡣
			siblings: function(elem, args) {
				return this.previouses(elem, args).concat(this.nexts(elem, args));
			},
			
			// �ŴΡ�
			index: function (elem) {
				var i = 0;
				while(elem = elem.previousSibling)
					if(elem.nodeType === 1)
						i++;
				return i;
			},
			
			// ƫ�Ƹ�λ�á�
			offsetParent: function (elem) {
				var me = elem;
				while ( (me = me.offsetParent) && !rBody.test(me.nodeName) && getStyle(me, "position") === "static" );
				return $(me || getDocument(elem).body);
			}
	
		},

		/**
		 * ��ȡһ���ڵ����ԡ�
		 * @static
		 * @param {Element} elem Ԫ�ء�
		 * @param {String} name ���֡�
		 * @return {String} ���ԡ�
		 */
		getAttr: $.attr,

		/**
		 * ����Ƿ�ָ��������
		 * @param {Element} elem Ԫ�ء�
		 * @param {String} className ������
		 * @return {Boolean} ������ڷ��� true��
		 */
		hasClass: function (elem, className) {
			return $(elem).hasClass(className);
		},
		
		/**
		 * ��ȡԪ�صļ�����ʽ��
		 * @param {Element} dom �ڵ㡣
		 * @param {String} name ���֡�
		 * @return {String} ��ʽ��
		 */
		getStyle: getStyle,

		/**
		 * ��ȡ��ʽ�ַ�����
		 * @param {Element} elem Ԫ�ء�
		 * @param {String} name ������������ʹ�����չ�������֡�
		 * @return {String} �ַ�����
		 */
		styleString:  getStyle,

		/**
		 * ��ȡ��ʽ���֡�
		 * @param {Element} elem Ԫ�ء�
		 * @param {String} name ������������ʹ�����չ�������֡�
		 * @return {String} �ַ�����
		 * @static
		 */
		styleNumber: styleNumber,

		/**
		 * ��ʽ��
		 * @static
		 * @type Object
		 */
		sizeMap: {},
		
		/**
		 * ��ʾԪ�ص���ʽ��
		 * @static
		 * @type Object
		 */
		display: { position: "absolute", visibility: "visible", display: "block" },

		/**
		 * ����Ҫ��λ�� css ���ԡ�
		 * @static
		 * @type Object
		 */
		styleNumbers: map('fillOpacity fontWeight lineHeight opacity orphans widows zIndex zoom', {}, {}),
	
		/**
		 * Ĭ������ z-index ��
		 * @property
		 * @type Number
		 * @private
		 * @static
		 */
		zIndex: 10000,
		
		/**
		 * ���Ԫ�ص� display ���ԡ�
		 * @param {Element} elem Ԫ�ء�
		 */
		show: function (elem) {
			$(elem).show();
		},
		
		/**
		 * ����Ԫ�ص� display ���� none��
		 * @param {Element} elem Ԫ�ء�
		 */
		hide: function (elem) {
			$(elem).hide();
		},
		
		/**
		 * ��ȡָ��css���Եĵ�ǰֵ��
		 * @param {Element} elem Ԫ�ء�
		 * @param {Object} styles ��Ҫ�ռ������ԡ�
		 * @return {Object} �ռ������ԡ�
		 */
		getStyles: function (elem, styles) {

			var r = {};
			for(var style in styles) {
				r[style] = elem.style[style];
			}
			return r;
		},
		
		/**
		 * ����ָ��css���Եĵ�ǰֵ��
		 * @param {Element} elem Ԫ�ء�
		 * @param {Object} styles ��Ҫ�ռ������ԡ�
		 */
		setStyles: function (elem, styles) {

			apply(elem.style, styles);
		},
	
		/// #endif
		
		/// #if defined(ElementDimension) ||  defined(ElementStyle)

		/**
		 * ���ݲ�ͬ�����ݽ��м��㡣
		 * @param {Element} elem Ԫ�ء�
		 * @param {String} type ���롣 һ�� type �ɶ��������,���ӣ�һ�������ɶ��������+���ӣ�һ����������������ɣ� ��һ���ֿ����������ַ�֮һ: m b p t l r b h w  �ڶ����ֿ����������ַ�֮һ: x y l t r b������Ҳ������: outer inner  �� 
		 * @return {Number} ����ֵ��
		 * mx+sx ->  ���С��
		 * mx-sx ->  �ڴ�С��
		 */
		getSize: (function() {
			
			var borders = {
					m: 'margin#',
					b: 'border#Width',
					p: 'padding#'
				},
				map = {
					t: 'Top',
					r: 'Right',
					b: 'Bottom',
					l: 'Left'
				},
				init,
				tpl,
				rWord = /\w+/g;
				
			if(window.getComputedStyle) {
				init = 'var c=e.ownerDocument.defaultView.getComputedStyle(e,null);return ';
				tpl	= '(parseFloat(c["#"]) || 0)';
			} else {
				init = 'return ';
				tpl	= '(parseFloat(Element.getStyle(e, "#")) || 0)';
			}
			
			/**
			 * ���� type��
			 * @param {String} type �����ַ�����
			 * @return {String} �������ַ�����
			 */
			function format(type) {
				var t, f = type.charAt(0);
				switch(type.length) {
					
					// borders + map
					// borders + x|y
					// s + x|y
					case 2:
						t = type.charAt(1);
						if(t in map) {
							t = borders[f].replace('#', map[t]);
						} else {
							return f === 's' ? 'e.offset' + (t === 'x' ? 'Width' : 'Height')  :
									'(' + format(f + (t !== 'y' ? 'l' : 't')) + '+' + 
									format(f + (t === 'x' ? 'r' : 'b')) + ')';
						}
							
						break;
					
					// map
					// w|h
					case 1:
						if(f in map) {
							t = map[f].toLowerCase();
						} else if(f !== 'x' && f !== 'y') {
							return 'Element.styleNumber(e,"' + (f === 'h' ? 'height' : 'width') + '")';
						} else {
							return f;	
						}
						
						break;
						
					default:
						t = type;
				}
				
				return tpl.replace('#', t);
			}
			
			return function (elem, type) {
				return (e.sizeMap[type] || (e.sizeMap[type] = new Function("e", init + type.replace(rWord, format))))(elem);
			}
		
		})(),
		
		/// #endif
		
		/// #ifdef ElementDimension
		
		/**
		 * ����һ��Ԫ�ؿ��϶���
		 * @param {Element} elem Ҫ���õĽڵ㡣
		 * @static
		 */
		setMovable: function (elem) {
			if(!rMovable.test(getStyle(elem, "position")))
				elem.style.position = "relative";
		},
		
		/// #endif
		
		/**
		 * ��һ����Ա���ӵ� Element ���������ࡣ
		 * @param {Object} obj Ҫ���ӵĶ���
		 * @param {Number} listType = 1 ˵����θ��Ƶ� ElementList ʵ����
		 * @return {Element} this
		 * @static
		 * �� Element ��չ���ڲ��� Element ElementList document ����չ��
		 * �������ڲ�ͬ�ĺ������ò�ͬ�ķ�����չ������ָ����չ���͡�
		 * ��ν����չ����һ��������Ҫ�ĺ�����
		 *
		 *
		 * DOM ���� �� ������
		 *
		 *  1,   ����    setText - ִ�н������ this�� ���� this ��(Ĭ��)
		 *  2  getText - ִ�н�������ݣ����ؽ�����顣 
		 *  3  getElementById - ִ�н����DOM �� ElementList������  ElementList ��װ��
		 *  4   hasClass - ֻҪ��һ�����ص��� true ��ֵ�� �ͷ������ֵ��
		 * 
		 *
		 *  ���� copyIf ���ڲ�ʹ�á�
		 */
		implement: function (members, listType, copyIf) {

			
			Object.each(members, function (value, func) {
				
				var i = this.length;
				while(i--) {
					var cls = this[i].prototype;
					if(!copyIf || !cls[func]) {
						
						if(!i) {
							switch (listType) {
								case 2:  //   return array
									value = function () {
										return this.invoke(func, arguments);
									};
									break;
									
								case 3:  //  return ElementList
									value = function () {
										var args = arguments, r = new ElementList;
										this.forEach(function (node) {
											r.concat(node[func].apply(node, args));
										});
										return r;
			
									};
									break;
								case 4: // return if true
									value = function () {
										var me = this, i = -1, item = null;
										while (++i < me.length && !item)
											item = me[i][func].apply(me[i], arguments);
										return item;
									};
									break;
								default:  // return  this
									value = function () {
										var me = this, len = me.length, i = -1;
										while (++i < len)
											me[i][func].apply(me[i], arguments);
										return this;
									};
									
							}
						}
						
						cls[func] = value;
					}
				}
				
				
				
				
			}, [ElementList, Document, e, Control]);
			
			/// #ifdef SupportIE8

			if(ep.$version) {
				ep.$version++;
			}

			/// #endif

			return this;
		},

		/**
		 * �������ڣ���һ�����󸽼ӵ� Element ����
		 * @static
		 * @param {Object} obj Ҫ���ӵĶ���
		 * @param {Number} listType = 1 ˵����θ��Ƶ� ElementList ʵ����
		 * @param {Number} docType ˵����θ��Ƶ� Document ʵ����
		 * @return {Element} this
		 */
		implementIf: function (obj, listType) {
			return this.implement(obj, listType, true);
		},
		
		/**
		 * �����¼���
		 * @param {String} �¼�����
		 * @param {Function} trigger ��������
		 * @return {Function} ��������
		 * @static
		 * @memberOf Element
		 * ԭ�� Element.addEvents ���Խ�����⡣ ������ DOM �������ԣ������ṩ defineEvents ���㶨���ʺ� DOM ���¼���
		 * defineEvents ��Ҫ��� 3 ������:
		 * <ol>
		 * <li> ����¼�ʹ��һ���¼���Ϣ��
		 *      <p>
		 * 	 	 	���е� DOM �¼���  add �� ��һ���ģ������������ṩһ������: JPlus.defineEvents('e1 e2 e3')
		 * 		</p>
		 * </li>
		 *
		 * <li> �¼�������
		 *      <p>
		 * 	 	 	һ���Զ��� DOM �¼�������һ���¼��ı�����
		 * 			��������ṩһ����������: JPlus.defineEvents('mousewheel', 'DOMMouseScroll')
		 * 		</p>
		 * </li>
		 *
		 * <li> �¼�ί�С�
		 *      <p>
		 * 	 	 	һ���Զ��� DOM �¼������������е��¼���һ���¼�������һ���¼������� ���� ctrlenter ���� keyup �����ϼӹ��ġ�
		 * 			��������ṩһ����������: JPlus.defineEvents('ctrlenter', 'keyup', function (e) { (�ж��¼�) })
		 * 		</p>
		 * </li>
		 *
		 * @example
		 * <code>
		 *
		 * Element.defineEvents('mousewheel', 'DOMMouseScroll')  //  �� FF ����   mousewheel
		 * �滻   DOMMouseScroll ��
		 *
		 * Element.defineEvents('mouseenter', 'mouseover', function (e) {
		 * 	  if( !isMouseEnter(e) )   // mouseenter  �ǻ��� mouseover ʵ�ֵ��¼���  ����� ����
		 * mouseenter ʱ�� ȡ���¼���
		 *        e.returnValue = false;
		 * });
		 *
		 * </code>
		 */
		addEvents: function (events, baseEvent, initEvent) {
			
			var ee = p.Events.element;
			
			if(Object.isObject(events)) {
				p.Object.addEvents.call(this, events);
				return this;
			}
			
			
			// ɾ���Ѿ��������¼���
			delete ee[events];
			
	
			// ��ÿ���¼�ִ�ж��塣
			map(events, Function.from(o.extendIf(Function.isFunction(baseEvent) ? {
	
				initEvent: baseEvent
	
			} : {
	
				initEvent: initEvent ? function (e) {
					return ee[baseEvent].initEvent.call(this, e) !== false && initEvent.call(this, e);
				} : ee[baseEvent].initEvent,
	
				//  ������� baseEvent����������� ����ʹ��Ĭ�Ϻ�����
				add: function (elem, type, fn) {
					elem.addEventListener(baseEvent, fn, false);
				},
	
				remove: function (elem, type, fn) {
					elem.removeEventListener(baseEvent, fn, false);
				}
	
			}, ee.$default)), ee);
	
			return e.addEvents;
		},
		
		/**
		 * ��ȡԪ�ص��ĵ���
		 * @param {Element} elem Ԫ�ء�
		 * @return {Document} �ĵ���
		 */
		getDocument: getDocument
		
	})
		
	/// #if !defind(SupportIE8) && (ElementEvent || ElementDomReady)
	
	/**
	 * xType
	 * @type String
	 */
	.implementIf(apply({xType: "element"}, eventObj))
	
	/// #else
	
	/// .implementIf({xType: "element"})
		
	/// #endif
	
	.implement({
	
		/// #ifdef ElementManipulation

		/**
		 * ����ǰ�ڵ���ӵ������ڵ㡣
		 * @param {Element/String} elem=document.body �ڵ㡢�ؼ���ڵ�� id �ַ�����
		 * @return {Element} this
		 * this.appendTo(parent)  �൱�� elem.appendChild(this) ��
		 * appendTo ͬʱִ��  render(parent, null) ֪ͨ��ǰ�ؼ�����ִ����Ⱦ��
		 */
		appendTo: function (parent) {
			
			// �л����ڵ㡣
			parent = parent && parent !== true ? $(parent) : document.body;

			// ����ڵ�
			return this.render(parent, null);

		},
		
		/**
		 * ����ǰ�б���ӵ�ָ�����ڵ㡣
		 * @param {Element/Control} parent ��Ⱦ��Ŀ�ꡣ
		 * @param {Element/Control} refNode ��Ⱦ��λ�á�
		 * @protected
		 */
		render: function (parent, refNode) {
			return parent.insertBefore(this.dom || this, refNode);
		},

		/**
		 * ɾ��Ԫ���ӽڵ����
		 * @param {Object/Undefined} child �ӽڵ㡣
		 * @return {Element} this
		 */
		remove: function (child) {
			
			// û�в����� ɾ������
			if(!arguments.length)
				return this.detach();
				
			child.detach ? child.detach() : this.removeChild(child);
			return this;
		},
		
		/**
		 * �Ƴ��ڵ㱾��
		 */
		detach: function() {
			var elem = this.dom || this;
			elem.parentNode && elem.parentNode.removeChild(elem);
			return this;
		},

		/**
		 * �ͷŽڵ�������Դ��
		 */
		dispose: function () {
			this.detach();
		},
		
		/// #endif
		
		/// #ifdef ElementStyle

		/**
		 * �������ӵ�͸���ȡ�
		 * @param {Number} value ͸���ȣ� 0 - 1 ��
		 * @return {Element} this
		 */
		setOpacity: function (value) {
			$(this.dom || this).css('opacity', value);
			return this;

		},

		/**
		 * ����Ԫ�ز���ѡ��
		 * @param {Boolean} value �Ƿ��ѡ��
		 * @return this
		 */
		setUnselectable: 'unselectable' in div ? function (value) {

			(this.dom || this).unselectable = value !== false ? 'on' : '';
			return this;
		} : 'onselectstart' in div ? function (value) {

			(this.dom || this).onselectstart = value !== false ? Function.returnFalse : null;
			return this;
		} : function (value) {

			(this.dom || this).style.MozUserSelect = value !== false ? 'none' : '';
			return this;
		},

		/**
		 * ��Ԫ��������ǰ��
		 * @param {Element} [elem] �ο�Ԫ�ء�
		 * @return this
		 */
		bringToFront: function (elem) {
			
			
			var thisElem = this.dom || this,
				targetZIndex = elem && (parseInt(getStyle(elem.dom || elem, 'zIndex')) + 1) || e.zIndex++;
			
			// �����ǰԪ�ص� z-index δ����Ŀ��ֵ��������
			if(!(getStyle(thisElem, 'zIndex') > targetZIndex))
				thisElem.style.zIndex = targetZIndex;
			
			return this;
		},
		
		/// #endif
		
		/// #ifdef ElementAttribute

		/**
		 * �������ýڵ�ȫ�����Ժ���ʽ��
		 * @param {String/Object} name ���֡�
		 * @param {Object} [value] ֵ��
		 * @return {Element} this
		 */
		set: function (name, value) {

			var me = this;

			if (typeof name === "string") {
				
				var elem = me.dom || me;

				// event ��
				if(name.match(rEventName))
					me.on(RegExp.$1, value);

				// css ��
				else if(elem.style && (name in elem.style || rStyle.test(name)))
					me.setStyle(name, value);

				// attr ��
				else
					me.setAttr(name, value);

			} else if(o.isObject(name)) {

				for(value in name)
					me.set(value, name[value]);

			}

			return me;


		},
		
		/**
		 * ����ֵ��
		 * @param {String/Boolean} ֵ��
		 * @return {Element} this
		 */
		setText: function (value) {
			var elem = this.dom || this;

			switch(elem.tagName) {
				case "SELECT":
				case "INPUT":
				case "TEXTAREA":
					$(elem).val(value);
					break;
				default:
					$(elem).text(value);
			}
			return  this;
		},
	
		/// #endif
	
		/// #ifdef ElementDimension

		/**
		 * �ı��С��
		 * @param {Number} x ���ꡣ
		 * @param {Number} y ���ꡣ
		 * @return {Element} this
		 */
		setSize: function (x, y) {
			var me = this,
				p = formatPoint(x,y);

			if(p.x != null)
				me.setWidth(p.x - e.getSize(me.dom || me, 'bx+px'));
	
			if (p.y != null)
				me.setHeight(p.y - e.getSize(me.dom || me, 'by+py'));
	
			return me;
		},

		/**
		 * ��ȡԪ�������С����������������
		 * @param {Number} value ֵ��
		 * @return {Element} this
		 */
		setWidth: function (value) {

			$(this.dom || this).width(value <= 0 ? 0 : value);
			return this;
		},

		/**
		 * ��ȡԪ�������С����������������
		 * @param {Number} value ֵ��
		 * @return {Element} this
		 */
		setHeight: function (value) {

			$(this.dom || this).height(value <= 0 ? 0 : value);
			return this;
		},
		
		/// #endif
	
		/// #ifdef ElementOffset

		/**
		 * ����Ԫ�ص����λ�á�
		 * @param {Point} p
		 * @return {Element} this
		 */
		setOffset: function (p) {

			var s = (this.dom || this).style;
			s.top = p.y + 'px';
			s.left = p.x + 'px';
			return this;
		},

		/**
		 * ����Ԫ�صĹ̶�λ�á�
		 * @param {Number} x ���ꡣ
		 * @param {Number} y ���ꡣ
		 * @return {Element} this
		 */
		setPosition: function (x, y) {
			x = formatPoint(x, y);
			$(this.dom || this).offset({left: x.x, top: x.y});
			return this;
		},

		/**
		 * ������
		 * @param {Element} dom
		 * @param {Number} x ���ꡣ
		 * @param {Number} y ���ꡣ
		 * @return {Element} this
		 */
		setScroll: function (x, y) {
			var elem = this.dom || this, p = formatPoint(x, y);

			if(p.x != null)
				elem.scrollLeft = p.x;
			if(p.y != null)
				elem.scrollTop = p.y;
			return this;

		}
	
		/// #endif
		
	})
	
	/// #ifdef ElementEvent
	
	.implement(p.IEvent)
	
	/// #endif
	
	.implement({

		/**
		 * ��ȡ͸���ȡ�
		 * @method
		 * @return {Number} ͸���ȡ� 0 - 1 ��Χ��
		 */
		getOpacity: function () {
			return $.css(this.dom || this, 'opacity');
		},

		/**
		 * ��ȡֵ��
		 * @return {Object/String} ֵ������ͨ�ڵ㷵�� text ���ԡ�
		 */
		getText: function () {
			var elem = this.dom || this;

			switch(elem.tagName) {
				case "SELECT":
				case "INPUT":
				case "TEXTAREA":
					return $(elem).val();
				default:
					return $(elem).text();
			}
		},
	
		/// #ifdef ElementDimension

		/**
		 * ��ȡԪ�ؿ��������С������ border ��С��
		 * @return {Point} λ�á�
		 */
		getSize: function () {
			var elem = this.dom || this;

			return new Point(elem.offsetWidth, elem.offsetHeight);
		},

		/**
		 * ��ȡ���������С��
		 * @return {Point} λ�á�
		 */
		getScrollSize: function () {
			var elem = this.dom || this;

			return new Point(elem.scrollWidth, elem.scrollHeight);
		},
	
		/// #endif
	
		/// #ifdef ElementOffset

		/**
		 * ��ȡԪ�ص����λ�á�
		 * @return {Point} λ�á�
		 */
		getOffset: function () {

			// ������ù� left top �����Ƿǳ����ɵ��¡�
			var elem = $(this.dom || this),
				offset = elem.position();
				
			// ���� auto �� �� ��Ϊ 0 ��
			return new Point(
				offset.left,
				offset.top
			);
		},

		/**
		 * ��ȡ�ุԪ�ص�ƫ�
		 * @return {Point} λ�á�
		 */
		getPosition: function () {

			var elem = $(this.dom || this),
				offset = elem.offset();

			return new Point(
				offset.left,
				offset.top
			    );
		},

		/**
		 * ��ȡ�������ѹ����Ĵ�С��
		 * @return {Point} λ�á�
		 */
		getScroll:  function () {
			var elem = this.dom || this;
			return new Point(elem.scrollLeft, elem.scrollTop);
		}

		/// #endif
		
	}, 2)
	
	.implement({
		
		/// #ifdef ElementTraversing
		
		/**
		 * ִ��һ���򵥵�ѡ������
		 * @method
		 * @param {String} selecter ѡ������ �� h2 .cls attr=value ��
		 * @return {Element/undefined} �ڵ㡣
		 */
		findAll: function(selecter){
			return new ElementList($(this.dom || this).find(selecter));
		},

		/**
		 * �����ƥ��Ľڵ㡣
		 * @param {String/Function/Number} treeWalker �����������ú����� {#link Element.treeWalkers} ָ����
		 * @param {Object} [args] ���ݸ����������Ĳ�����
		 * @return {Element} Ԫ�ء�
		 */
		get: function (treeWalker, args) {

			switch (typeof treeWalker) {
				case 'string':
					break;
				case 'function':
					args = treeWalker;
					treeWalker = 'all';
					break;
				case 'number':
					if(treeWalker < 0) {
						args = -treeWalker;
						treeWalker = 'last';
					} else {
						args = treeWalker;
						treeWalker = 'first';
					}
					
			}
			
			return e.treeWalkers[treeWalker](this.dom || this, args);
		},
	
		/// #endif
		
		/// #ifdef ElementManipulation

		/**
		 * ��ĳ��λ�ò���һ��HTML ��
		 * @param {String/Element} html ���ݡ�
		 * @param {String} [where] ����ص㡣 beforeBegin   �ڵ���    beforeEnd   �ڵ���
		 * afterBegin    �ڵ���  afterEnd     �ڵ���
		 * @return {Element} ����Ľڵ㡣
		 */
		insert: function (html, where) {

			var elem = this.dom || this, p, refNode = elem;

			html = e.parse(html, elem);

			switch (where) {
				case "afterBegin":
					p = this;
					refNode = elem.firstChild;
					break;
				case "afterEnd":
					refNode = elem.nextSibling;
				case "beforeBegin":
					p = elem.parentNode;
					break;
				default:
					p = this;
					refNode = null;
			}
			
			// ���� HTML ����Ⱦ��
			return html.render(p, refNode);
		},

		/**
		 * ����һ��HTML ��
		 * @param {String/Element} html ���ݡ�
		 * @return {Element} Ԫ�ء�
		 */
		append: function (html) {
			
			
			// �����Ԫ�����ʺ��Լ�����Ⱦ������
			return e.parse(html, this.dom || this).render(this, null);
		},

		/**
		 * ��һ���ڵ�����һ���ڵ��滻��
		 * @param {Element/String} html ���ݡ�
		 * @return {Element} �滻֮�����Ԫ�ء�
		 */
		replaceWith: function (html) {
			var elem = this.dom || this;
			
			html = e.parse(html, elem);
			$(elem).replaceWith(html);
			return html;
		},
		
		/**
		 * ���ƽڵ㡣
		 * @param {Boolean} cloneEvent=false �Ƿ����¼���
		 * @param {Boolean} contents=true �Ƿ�����Ԫ�ء�
		 * @param {Boolean} keepId=false �Ƿ��� id ��
		 * @return {Element} Ԫ�ء�
		 */
		clone: function (cloneEvent, contents, keepId) {

			return $(this).clone(cloneEvent)[0];
		}
		
		/// #endif

	}, 3)
	
	.implement({
		
		/// #ifdef ElementTraversing
		
		/**
		 * ִ��һ���򵥵�ѡ������
		 * @param {String} selecter ѡ������ �� h2 .cls attr=value ��
		 * @return {Element/undefined} �ڵ㡣
		 */
		find: function (selector) {
			return $$($(this.dom || this).find(selector)[0]);
		},
		
		/// #endif
		
		/// #ifdef ElementManipulation

		/**
		 * �ж�һ���ڵ��Ƿ����һ���ڵ㡣 һ���ڵ��������
		 * @param {Element} child �ӽڵ㡣
		 * @return {Boolean} �з���true ��
		 */
		contains: function (child) {
			var elem = this.dom || this;
			child = child.dom || child;
			return child == elem || e.hasChild(elem, child);
		},

		/**
		 * �ж�һ���ڵ��Ƿ����ӽڵ㡣
		 * @param {Element} child �ӽڵ㡣
		 * @return {Boolean} �з���true ��
		 */
		hasChild: function (child) {
			var elem = this.dom || this;
			return child ? e.hasChild(elem, child.dom || child) : elem.firstChild !== null;
		},
		
		/// #endif
		
		/// #ifdef ElementStyle

		/**
		 * �ж�һ���ڵ��Ƿ����ء�
		 * @param {Element} elem Ԫ�ء�
		 * @return {Boolean} ���ط��� true ��
		 */
		isHidden: function () {
			var elem = this.dom || this;

			return (elem.style.display || getStyle(elem, 'display')) === 'none';
		}
		
		/// #endif
		
	}, 4);
	
	getWindowScroll = 'pageXOffset' in window ? function () {
		var win = this.defaultView;
		return new Point(win.pageXOffset, win.pageYOffset);
	} : ep.getScroll;
		
	/**
	 * @class Document
	 */
	Document.implement({
		
		/// #ifdef ElementManipulation

		/**
		 * ����һ��HTML ��
		 * @param {String/Element} html ���ݡ�
		 * @return {Element} Ԫ�ء�
		 */
		append: function (html) {
			return $$(this.body).append(html);
		},
	
		/// #endif
		
		/// #ifdef ElementCore

		/**
		 * ����һ���ڵ㡣
		 * @param {Object} tagName
		 * @param {Object} className
		 */
		create: function (tagName, className) {
			

			/// #ifdef SupportIE6

			var div = $$(this.createElement(tagName));

			/// #else

			/// var div = this.createElement(tagName);

			/// #endif

			div.className = className;

			return div;
		},
	
		/// #endif
		
		/// #ifdef ElementDimension
		
		/**
		 * ��ȡԪ�ؿ��������С������ margin �� border ��С��
		 * @method getSize
		 * @return {Point} λ�á�
		 */
		getSize: function () {
			var doc = this.dom;

			return new Point(doc.clientWidth, doc.clientHeight);
		},

		/**
		 * ��ȡ���������С��
		 * @return {Point} λ�á�
		 */
		getScrollSize: function () {
			var html = this.dom,
				min = this.getSize(),
				body = this.body;
				
				
			return new Point(Math.max(html.scrollWidth, body.scrollWidth, min.x), Math.max(html.scrollHeight, body.scrollHeight, min.y));
		},
		
		/// #ifdef ElementOffset
		
		/// #endif

		/**
		 * ��ȡ�ุԪ�ص�ƫ�
		 * @return {Point} λ�á�
		 */
		getPosition: getWindowScroll,
		
		/**
		 * ��ȡ�������ѹ����Ĵ�С��
		 * @return {Point} λ�á�
		 */
		getScroll: getWindowScroll,

		/**
		 * ������
		 * @method setScroll
		 * @param {Number} x ���ꡣ
		 * @param {Number} y ���ꡣ
		 * @return {Document} this ��
		 */
		setScroll: function (x, y) {
			var doc = this, p = formatPoint(x, y);
			if(p.x == null)
				p.x = doc.getScroll().x;
			if(p.y == null)
				p.y = doc.getScroll().y;
			doc.defaultView.scrollTo(p.x, p.y);

			return doc;
		},
		
		/// #endif
		
		/**
		 * ����Ԫ�ط��ؽڵ㡣
		 * @param {String} ... ����� id �����
		 * @return {ElementList} ���ֻ��1������������Ԫ�أ����򷵻�Ԫ�ؼ��ϡ�
		 */
		getDom: function () {
			return arguments.length === 1 ? $$(this.getElementById(arguments[0])) :  new ElementList(o.update(arguments, this.getElementById, null, this));
		}
		
	});
	
	/**
	 * @namespace Control
	 */
	apply(Control, {
		
		/**
		 * ���ࡣ
		 */
		base: e,
		
		/**
		 * ��ָ�����ֵķ���ί�е���ǰ����ָ���ĳ�Ա��
		 * @param {Object} control �ࡣ
		 * @param {String} delegate ί�б�����
		 * @param {String} methods ���г�Ա����
		 * @param {Number} type ���͡� 1 - ���ر��� 2 - ����ί�з��� 3 - �����Լ���������Ϊ�ؼ��� 
		 * @param {String} [methods2] ��Ա��
		 * @param {String} [type2] ���͡�
		 * ����һ���ؼ��������Ƕ� DOM �ķ�װ�� ��˾�����Ҫ��һ������ת��Ϊ�Խڵ�ĵ��á�
		 */
		delegate: function(control, target, methods, type, methods2, type2) {
			
			if (methods2) 
				Control.delegate(control, target, methods2, type2);
			
			
			map(methods, function(func) {
				switch (type) {
					case 2:
						return function(args1, args2, args3) {
							return this[target][func](args1, args2, args3);
						};
					case 3:
						return function(args1, args2) {
							return this[target][func](args1 && args1.dom || args1, args2 ? args2.dom || args2 : null);
						};
					default:
						return function(args1, args2, args3) {
							this[target][func](args1, args2, args3);
							return this;
						};
				}
			}, control.prototype);
			
			return Control.delegate;
		}
		
	});
	
	Control.delegate(Control, 'dom', 'addEventListener removeEventListener scrollIntoView focus blur', 2, 'appendChild removeChild insertBefore replaceChild', 3);
	
	/**
	 * ����ǰ�б���ӵ�ָ�����ڵ㡣
	 * @param {Element/Control} parent ��Ⱦ��Ŀ�ꡣ
	 * @param {Element/Control} refNode ��Ⱦ��λ�á�
	 * @protected
	 */
	ElementList.prototype.render = function (parent, refNode) {
			parent = parent.dom || parent;
			for(var i = 0, len = this.length; i < len; i++)
				parent.insertBefore(this[i], refNode);
	};

	/// #ifdef ElementCore
	
	/// #endif
		
	/// #ifdef ElementNode
	
	map('checked disabled selected', function (treeWalker) {
		return function(elem, args) {
			args = args !== false;
			return this.children(elem, function (elem) {
				return elem[treeWalker] !== args;
			});
		};
	}, e.treeWalkers);
	
	var setter = {};
	
	o.each({
		setStyle: 'css',
		empty: 'empty',
		setAttr: 'attr',
		addClass: 'addClass',
		removeClass: 'removeClass',
		toggleClass: 'toggleClass',
		setHtml: 'html',
		animate: 'animate',
		show: 'show',
		hide: 'hide',
		toggle: 'toggle'
	}, function (func, name){
		this[name] = function () {
			var me = $(this.dom || this);
			me[func].apply(me, arguments);
			return this;
		}
	}, setter);
	
	e.implement(setter);
	
	o.each({
		getStyle: 'css',
		getAttr: 'attr',
		getHtml: 'html',
		getWidth: 'width',
		getHeight: 'height',
		hasClass: 'hasClass'
	},   function (func, name){
		this[name] = function () {
			var me = $(this.dom || this);
			return me[func].apply(me, arguments);
		}
	}, setter = {});
	
	e.implement(setter, 2);
	
	
	
	/// #endif
	
	/**
	 * ��ȡ�ڵ㱾��
	 */
	document.dom = document.documentElement;
	
	/// #ifdef SupportIE8

	if (navigator.isStandard) {

	/// #endif
		
		/// #ifdef ElementEvent
		
		window.Event.prototype.stop = pep.stop;

		initMouseEvent = initKeyboardEvent = initUIEvent = function (e) {

			if(!e.srcElement)
				e.srcElement = e.target.nodeType === 3 ? e.target.parentNode : e.target;

		};
		
		/// #endif

	/// #ifdef SupportIE8
		
	} else {
		
		ep.$version = 1;
		
		$$ = function (id) {
			
			// ��ȡ�ڵ㱾��
			var dom = getElementById(id);
	
			// �� Element ��Ա���Ƶ��ڵ㡣
			// ���� $version �����Ƿ���Ҫ������������֤ÿ���ڵ�ֻ����һ�Ρ�
			if(dom && dom.nodeType === 1 && dom.$version !== ep.$version)
				o.extendIf(dom, ep);
	
			return dom;
			
		};
		
		/**
		 * ���ص�ǰ�ĵ�Ĭ�ϵ���ͼ��
		 * @type {Window}
		 */
		document.defaultView = document.parentWindow;
		
		/// #ifdef ElementEvent
		
		initUIEvent = function (e) {
			if(!e.stop) {
				e.target = $$(e.srcElement);
				e.stopPropagation = pep.stopPropagation;
				e.preventDefault = pep.preventDefault;
				e.stop = pep.stop;
			}
		};

		// mouseEvent
		initMouseEvent = function (e) {
			if(!e.stop) {
				initUIEvent(e);
				e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement;
				var dom = getDocument(e.target).dom;
				e.pageX = e.clientX + dom.scrollLeft;
				e.pageY = e.clientY + dom.scrollTop;
				e.layerX = e.x;
				e.layerY = e.y;
				//  1 �� ����  2 ��  �м���� 3 �� �һ�
				e.which = (e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0)));
			
			}
		};

		// keyEvents
		initKeyboardEvent = function (e) {
			if(!e.stop) {
				initUIEvent(e);
				e.which = e.keyCode;
			}
		};
	
		try {
	
			//  �޸�IE6 �� css �ı䱳��ͼ���ֵ���˸��
			document.execCommand("BackgroundImageCache", false, true);
		} catch(e) {
	
		}
	
		/// #endif
		
	}
	
	/// #endif
	
	apply(p, {
	
		$: $$,
		
		/**
		 * Ԫ�ء�
		 */	
		Element: e,
		
		/// #ifdef ElementEvent
		
		/**
		 * ��ʾ�¼��Ĳ�����
		 * @class JPlus.Event
		 */
		Event: Class(pep),
		
		/// #endif
		
		/**
		 * �ĵ���
		 */
		Document: Document
			
	});
	
	map("$ Element Event Document", p, window, true);
	
	window.$$ = $$;
		
	/// #ifdef ElementEvent
	
	/**
	 * Ĭ���¼���
	 * @type Object
	 * @hide
	 */
	namespace("JPlus.Events.element.$default", {

		/**
		 * ������ǰ�¼����õĲ�����
		 * @param {Object} elem ����
		 * @param {Event} e �¼�������
		 * @param {Object} target �¼�Ŀ�ꡣ
		 * @return {Event} e �¼�������
		 */
		trigger: function (elem, type, fn, e) {
			return fn(e = new p.Event(elem, type, e)) && (!elem[type = 'on' + type] || elem[type](e) !== false);
		},

		/**
		 * �¼�������Բ������д���
		 * @param {Event} e �¼�������
		 */
		initEvent: Function.empty,

		/**
		 * ��Ӱ��¼���
		 * @param {Object} elem ����
		 * @param {String} type ���͡�
		 * @param {Function} fn ������
		 */
		add: function (elem, type, fn) {
			elem.addEventListener(type, fn, false);
		},

		/**
		 * ɾ���¼���
		 * @param {Object} elem ����
		 * @param {String} type ���͡�
		 * @param {Function} fn ������
		 */
		remove: function (elem, type, fn) {
			elem.removeEventListener(type, fn, false);
		}

	});

	e.addEvents
		("mousewheel blur focus focusin focusout scroll change select submit error load unload", initUIEvent)
		("click dblclick DOMMouseScroll mousedown mouseup mouseover mouseenter mousemove mouseleave mouseout contextmenu selectstart selectend", initMouseEvent)
		("keydown keypress keyup", initKeyboardEvent);

	if (navigator.isFirefox)
		e.addEvents('mousewheel', 'DOMMouseScroll');

	if (!navigator.isIE)
		e.addEvents
			('mouseenter', 'mouseover', checkMouseEnter)
			('mouseleave', 'mouseout', checkMouseEnter);
	
	/**
	 * �жϷ����¼���Ԫ���Ƿ��ڵ�ǰ������ڵĽڵ��ڡ�
	 * @param {Event} e �¼�����
	 * @return {Boolean} �����Ƿ�Ӧ�ô���  mouseenter��
	 */
	function checkMouseEnter(event) {
		
		return this !== event.relatedTarget && !e.hasChild(this, event.relatedTarget);

	}
	
	o.extendIf(window, eventObj);
	
	document.onReady = function(fn){
		$(fn);
	};
	
	document.onLoad = function(fn){
		$(document).load(fn);
	};
	
	/**
	 * @class
	 */

	/**
	 * ����һ�� id �� �����ȡ�ڵ㡣
	 * @param {String/Element} id ����� id �����
	 * @return {Element} Ԫ�ء�
	 */
	function getElementById(id) {
		return typeof id == "string" ? document.getElementById(id) : id;
	}
	
	/**
	 * ��ȡԪ�ص��ĵ���
	 * @param {Element} elem Ԫ�ء�
	 * @return {Document} �ĵ���
	 */
	function getDocument(elem) {
		return elem.ownerDocument || elem.document || elem;
	}
	
	/// #ifdef ElementTraversing
	
	/**
	 * ���ؼ򵥵ı���������
	 * @param {Boolean} getFirst ���ص�һ�����Ƿ�������Ԫ�ء�
	 * @param {String} next ��ȡ��һ����Աʹ�õ����֡�
	 * @param {String} first=next ��ȡ��һ����Աʹ�õ����֡�
	 * @return {Function} ����������
	 */
	function createTreeWalker(getFirst, next, first) {
		first = first || next;
		return getFirst ? function(elem, args) {
			args = args == undefined ? Function.returnTrue : getFilter(args);
			var node = elem[first];
			while (node) {
				if (node.nodeType === 1 && args.call(elem, node))
					return $(node);
				node = node[next];
			}
			return node;
		} : function (elem, args) {
			args = args == undefined ? Function.returnTrue : getFilter(args);
			var node = elem[first],
				r = new ElementList;
			while (node) {
				if (node.nodeType === 1 && args.call(elem, node))
					r.push(node);
				node = node[next];
			}
			return r;
		};
	}

	/**
	 * ��ȡһ��ѡ������
	 * @param {Number/Function/String} args ������
	 * @return {Funtion} ������
	 */
	function getFilter(args) {
		switch(typeof args) {
			case 'number':
				return function (elem) {
					return --args < 0;
				};
			case 'string':
				args = args.toUpperCase();
				return function (elem) {
					return elem.tagName === args;
				};
		}
		
		return args;
	}
	
	/// #endif

	/**
	 * ��ȡ��ʽ���֡�
	 * @param {Object} elem Ԫ�ء�
	 * @param {Object} name ��������
	 * @return {Number} ���֡�
	 */
	function styleNumber(elem, name) {
		return parseFloat($(elem).css(name));
	}
	
	/**
	 * ת������Ϊ��׼�㡣
	 * @param {Number} x X
	 * @param {Number} y Y
	 */
	function formatPoint(x, y) {
		return x && typeof x === 'object' ? x : {
			x:x,
			y:y
		};
	}
	
	var get = $.fn.get;
	
	$.fn.get = function(){
		return $$(get.apply(this, arguments));
	};

})(jQuery);


